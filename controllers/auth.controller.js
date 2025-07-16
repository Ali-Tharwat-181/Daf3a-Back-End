import {
  registerService,
  loginService,
  getMeService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
} from "../services/auth.service.js";

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
    const result = await getMeService(req.user._id || req.user.id); // Adjust depending on how your `req.user` is structured
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

// Forgot Password
export async function forgotPassword(req, res, next) {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Reset Password
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Update Password (authenticated user)
export async function updatePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await updatePasswordService(
      req.user._id,
      oldPassword,
      newPassword
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
