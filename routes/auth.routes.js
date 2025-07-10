import express from "express";
import {
  register,
  login,
  getMe,
  logout,
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

export default authRouter;
