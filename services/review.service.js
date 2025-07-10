import Review from "../models/Review.js";
import Mentor from "../models/Mentor.js";
import Workshop from "../models/Workshop.js";

export const createReview = async (reviewData) => {
  const { author, targetType, targetId, rating, comment } = reviewData;

  // Validate targetType
  if (!["mentor", "workshop"].includes(targetType)) {
    throw new Error("Invalid target type");
  }

  // Check if the target exists
  let target;
  if (targetType === "mentor") {
    target = await Mentor.findById(targetId);
  } else if (targetType === "workshop") {
    target = await Workshop.findById(targetId);
  }

  if (!target) {
    throw new Error("Target not found");
  }

  // Create and save the review
  const review = new Review({
    author,
    targetType,
    targetId,
    rating,
    comment,
  });

  return await review.save();
};

export const getReviewsByTarget = async (targetType, targetId) => {
  // Validate targetType
  if (!["mentor", "workshop"].includes(targetType)) {
    throw new Error("Invalid target type");
  }

  // Fetch reviews based on targetType and targetId
  const reviews = await Review.find({ targetType, targetId })
    .populate("author", "name email") // Populate author details
    .sort({ createdAt: -1 }); // Sort by creation date

  return reviews;
};
