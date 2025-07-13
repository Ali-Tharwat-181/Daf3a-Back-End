import User from "../models/User.js";
import Mentor from "../models/Mentor.js";
import Review from "../models/Review.js";

export const verifyMentor = async (id) => {
  const mentor = await Mentor.findByIdAndUpdate(
    id,
    { verified: true },
    { new: true } // returns updated doc
  );

  if (!mentor) {
    throw new Error("Mentor not found");
  }

  return mentor;
};

export const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
};

export const getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const totalMentors = await Mentor.countDocuments();
  const totalReviews = await Review.countDocuments();

  return {
    totalUsers,
    totalMentors,
    totalReviews,
  };
};
