import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.service.js";

// Register a new user
export async function registerService({
  name,
  email,
  password,
  phoneNumber,
  preferredLanguage,
  role,
}) {
  if (!name || !email || !password || !phoneNumber) {
    throw new Error("Please provide all required fields.");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists.");
  }
  const phoneExists = await User.findOne({ phoneNumber });
  if (phoneExists) {
    throw new Error("Phone number already registered.");
  }
  try {
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      preferredLanguage,
      role,
    });
    const token = generateToken(user._id, user.role);
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    };
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.phoneNumber) {
      throw new Error("Phone number already registered.");
    }
    throw err;
  }
}

// Login a user
export async function loginService({ email, password }) {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials.");
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }
  const token = generateToken(user._id, user.role);

  // All user data is now in the User model
  return {
    user: {
      _id: user._id,
      title: user.title,
      bio: user.bio,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      preferredLanguage: user.preferredLanguage,
      isRegistered: user.isRegistered,
      education: user.education,
      skills: user.skills,
      careerGoals: user.careerGoals,
      cvs: user.cvs,
      expertise: user.expertise,
      links: user.links,
      experience: user.experience,
      languages: user.languages,
      availability: user.availability,
      rating: user.rating,
      verified: user.verified,
      image: user.image,
    },
    token,
  };
}

// Get current user info

export async function getMeService(userId) {
  if (!userId) {
    throw new Error("Not authorized.");
  }

  const user = await User.findById(userId).select("-password"); // Exclude sensitive fields
  if (!user) {
    throw new Error("User not found.");
  }

  return { user };
}

// Logout a user (dummy for JWT)
export async function logoutService() {
  return { message: "Logged out successfully." };
}

// Forgot Password

export async function forgotPasswordService(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with that email.");
  const token = user.generatePasswordReset();
  await user.save();
  // Send email with reset link (replace URL as needed)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(
    user.email,
    "Password Reset",
    `<h1>Reset your password using this link: ${resetUrl}<h1>`
  );
  return { message: "Password reset link sent to email." };
}

// Reset Password
export async function resetPasswordService(token, newPassword) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid or expired token.");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return { message: "Password has been reset." };
}

// Update Password (authenticated user)
export async function updatePasswordService(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) throw new Error("Old password is incorrect.");
  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully." };
}
