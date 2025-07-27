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
import passport from "passport";
import "../config/passport.js"; // important!
import generateToken from "../utils/generateToken.js";

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

// Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id, req.user.role);
    res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
  }
);

// GitHub OAuth
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
authRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id, req.user.role);
    res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
  }
);

export default authRouter;
