import express from "express";
import { register, login, getMe, logout } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", register);
// Login
router.post("/login", login);
// Get current user (protected)
router.get("/me", authMiddleware, getMe);
// Logout
router.post("/logout", logout);

export default router;
