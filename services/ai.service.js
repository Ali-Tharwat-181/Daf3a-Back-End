import User from "../models/User.js";
import Workshop from "../models/Workshop.js";

import { getRecommendationsFromGemini } from "../utils/recommendation.service.js";

export const fetchRecommendationsForStudent = async (student) => {
  const mentors = await User.find({ role: "mentor" });
  const workshops = await Workshop.find();
  return await getRecommendationsFromGemini(student, mentors, workshops);
};
