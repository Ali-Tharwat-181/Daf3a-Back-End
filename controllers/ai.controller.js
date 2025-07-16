import { fetchRecommendationsForStudent } from "../services/ai.service.js";

export const getStudentRecommendations = async (req, res, next) => {
  try {
    const student = req.user;

    if (!student || student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access recommendations",
      });
    }

    const recommendations = await fetchRecommendationsForStudent(student);
    return res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};
