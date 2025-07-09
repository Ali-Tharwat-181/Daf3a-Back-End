import { registerService, loginService, getMeService, logoutService } from "../services/auth.service.js";

// Register a new user
export async function register(req, res, next) {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Login a user
export async function login(req, res, next) {
  try {
    const result = await loginService(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

// Get current user info
export async function getMe(req, res, next) {
  try {
    const result = await getMeService(req.user);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

// Logout a user
export async function logout(req, res, next) {
  const result = await logoutService();
  res.status(200).json({ success: true, ...result });
}
