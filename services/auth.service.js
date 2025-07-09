import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register a new user
export async function registerService({ name, email, password, phoneNumber, preferredLanguage, role }) {
  if (!name || !email || !password || !phoneNumber) {
    throw new Error("Please provide all required fields.");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists.");
  }
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
}

// Get current user info
export async function getMeService(user) {
  if (!user) {
    throw new Error("Not authorized.");
  }
  return { user };
}

// Logout a user (dummy for JWT)
export async function logoutService() {
  return { message: "Logged out successfully." };
}
