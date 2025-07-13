import {
  createReview,
  getReviewsByTarget,
} from "../services/review.service.js";

export const createReviewController = async (req, res) => {
  const { author, targetType, targetId, rating, comment } = req.body;

  if (!author || !targetType || !targetId || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
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
