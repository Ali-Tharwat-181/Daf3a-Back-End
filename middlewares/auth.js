import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    // 1. Get the user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 2. Attach user
    req.user = user;

    // 3. Find if this user has a student profile
    const student = await Student.findOne({ user: user._id });
    if (student) {
      req.student = student;
    }

    // 4. Find if this user has a mentor profile
    const mentor = await Mentor.findOne({ user: user._id });
    if (mentor) {
      req.mentor = mentor;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
