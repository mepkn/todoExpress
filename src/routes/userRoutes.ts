import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/userController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/update").put(protect, updateUserProfile);
router.route("/resetPassword").post(protect, updateUserPassword);

export default router;
