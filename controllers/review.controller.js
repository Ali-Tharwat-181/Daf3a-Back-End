import Review from "../models/Review.js";
import {
  createReview,
  deleteReview,
  getReviewsByTarget,
} from "../services/review.service.js";

export const createReviewController = async (req, res) => {
  const { targetType, targetId, rating, comment } = req.body;
  const author = req.user.id; // Get from authenticated user

  if (!targetType || !targetId || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user has already reviewed this target
    const existing = await Review.findOne({ author, targetId });

    if (existing) {
      return res
        .status(409)
        .json({ error: "You have already reviewed this item." });
    }

    const review = await createReview({
      author,
      targetType,
      targetId,
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteReviewController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const review = await deleteReview(req.params.id);
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByTargetController = async (req, res) => {
  const { targetType, targetId } = req.params;

  // Validate request parameters
  if (!targetType || !targetId) {
    return res.status(400).json({ error: "Target type and ID are required" });
  }

  // Fetch reviews
  try {
    const reviews = await getReviewsByTarget(targetType, targetId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
