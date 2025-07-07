import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


export const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, preferredLanguage, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      preferredLanguage,
      role, // optional, defaults to 'student'
    });

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Respond with user info (excluding password) and token
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
