import User from "../models/User.js";
import Review from "../models/Review.js";
import Workshop from "./../models/Workshop.js";

export const verifyMentor = async (id) => {
  const mentor = await User.findOneAndUpdate(
    { _id: id, role: "mentor" },
    { verified: true },
    { new: true }
  );
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  return mentor;
};

export const getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const totalMentors = await User.countDocuments({ role: "mentor" });
  const totalReviews = await Review.countDocuments();
  const totalWorkshops = await Workshop.countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  return {
    totalUsers,
    totalMentors,
    totalReviews,
    totalWorkshops,
    totalStudents,
  };
};
