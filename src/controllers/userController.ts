import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User, { UserDocument } from "../models/userModel";
import generateToken from "../utils/generateToken";

interface AuthRequest extends Request {
  user?: UserDocument & { _id: mongoose.Types.ObjectId };
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    let token = generateToken(res, user._id as string);
    res.json({
      userInfo: { _id: user._id, name: user.name, email: user.email },
      token: token,
      message: "Logged in successfully",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id);
    if (user) {
      user.name = req.body.name || user.name;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

const updateUserPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      throw new Error("Current password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  }
);

export {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserPassword,
  updateUserProfile,
};
