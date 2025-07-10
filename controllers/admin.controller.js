import {
  getAllMentors,
  verifyMentor,
  deleteReview,
  getAnalytics,
} from "../services/admin.service.js";

export const getAllMentorsController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const [error, mentors] = await getAllMentors();
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  res.status(200).json({ success: true, data: mentors });
};

export const verifyMentorController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const mentorId = req.params.id;
  const [error, mentor] = await verifyMentor(mentorId);
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  res.status(200).json({ success: true, data: mentor });
};

export const deleteReviewController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const reviewId = req.params.id;
  const [error, review] = await deleteReview(reviewId);
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  res.status(200).json({ success: true, data: review });
};

export const getAnalyticsController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const [error, analytics] = await getAnalytics();
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  res.status(200).json({ success: true, data: analytics });
};
