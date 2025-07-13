import Mentor from "../models/Mentor.js";
import User from "../models/User.js";

export const getMentors = async () => {
  const mentors = await Mentor.find().populate("user", "-password");
  return mentors;
};

export const getMentorById = async (id, user) => {
  const dbUser = await User.findById(user?._id);
  if (!dbUser || dbUser.role !== "mentor") {
    throw new Error("Unauthorized: Only mentors can access this resource");
  }

  const mentor = await Mentor.findById(id).populate("user", "-password");
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  const reviews = await Review.find({ targetType: "mentor", targetId: id });
  if (reviews.length > 0) {
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    mentor.rating = avgRating.toFixed(1);
  }

  return mentor;
};

export const createMentor = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentor") {
    throw new Error("Only users with mentor role can create a mentor profile");
  }

  const existingMentor = await Mentor.findOne({ user: userId });
  if (existingMentor) {
    throw new Error("Mentor already exists for this user");
  }

  return Mentor.create({ user: userId, ...body });
};
export const updateMentor = async (id, userId, userRole, body) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentor") {
    throw new Error("Only users with mentor role can update a mentor profile");
  }

  const mentor = await Mentor.findById(id);
  if (!mentor) {
    throw new Error("Mentor not found");
  }

  // if (mentor.user.toString() !== userId) {
  //   throw new Error("Unauthorized to update this mentor");
  // }

  Object.assign(mentor, body);
  await mentor.save();
  return mentor;
};
