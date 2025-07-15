import Mentor from "../models/Mentor.js";
import Workshop from "../models/Workshop.js";

import { getRecommendationsFromGemini } from "../utils/recommendation.service.js";

export const fetchRecommendationsForStudent = async (student) => {
  const mentors = await Mentor.find().populate("user");
  const workshops = await Workshop.find();
  return await getRecommendationsFromGemini(student, mentors, workshops);
};
