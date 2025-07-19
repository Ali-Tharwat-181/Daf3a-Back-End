import Review from "../models/Review.js";
import User from "../models/User.js";
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
    target = await User.findOne({ _id: targetId, role: "mentor" });
  } else if (targetType === "workshop") {
    target = await Workshop.findById(targetId);
  }

  if (!target) {
    throw new Error("Target not found");
  }

  // Create and save the review
  const review = new Review(reviewData);
  const savedReview = await review.save();

  if (targetType === "mentor") {
    await updateMentorRating(targetId);
  } else if (targetType === "workshop") {
    await updateWorkshopRating(targetId);
  }

  return savedReview;
};

export const getReviewsByTarget = async (targetType, targetId) => {
  // Validate targetType
  if (!["mentor", "workshop"].includes(targetType)) {
    throw new Error("Invalid target type");
  }

  // Fetch reviews based on targetType and targetId
  const reviews = await Review.find({ targetType, targetId })
    .populate("author", "name email image") // Populate author details
    .sort({ createdAt: -1 }); // Sort by creation date

  return reviews;
};

export const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (targetType === "mentor") {
    await updateMentorRating(targetId);
  } else if (targetType === "workshop") {
    await updateWorkshopRating(targetId);
  }
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
};

export const updateMentorRating = async (mentorId) => {
  const reviews = await Review.find({
    targetType: "mentor",
    targetId: mentorId,
  });
  if (reviews.length === 0) return;

  const avgRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await User.findOneAndUpdate(
    { _id: mentorId, role: "mentor" },
    { rating: avgRating.toFixed(1) }
  );
};

export const updateWorkshopRating = async (workshopId) => {
  const reviews = await Review.find({
    targetType: "workshop",
    targetId: workshopId,
  });

  if (reviews.length === 0) return;

  const avgRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await Workshop.findByIdAndUpdate(workshopId, {
    rating: avgRating.toFixed(1),
  });
};
