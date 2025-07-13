import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";

const authRouter = express.Router();

// Register
authRouter.post("/register", register);
// Login
authRouter.post("/login", login);
// Get current user (protected)
authRouter.get("/me", authMiddleware, getMe);
// Logout
authRouter.post("/logout", logout);

// Forgot Password
authRouter.post("/forgot-password", forgotPassword);

// Reset Password
authRouter.post("/reset-password", resetPassword);

// Update Password (protected)
authRouter.post("/update-password", authMiddleware, updatePassword);

export default authRouter;
