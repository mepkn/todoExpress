import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/userModel";

interface AuthRequest extends Request {
  user?: UserDocument | null;
}

const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // read jwt token from cookie
    // token = req.cookies.jwt;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: string;
        };
        const foundUser = await User.findById(decoded.userId).select(
          "-password"
        );
        if (!foundUser) {
          res.status(404);
          throw new Error("User not found");
        }
        req.user = foundUser;
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export default protect;
