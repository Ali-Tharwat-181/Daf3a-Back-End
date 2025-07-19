import User from "../models/User.js";
import Workshop from "../models/Workshop.js";

import { getRecommendationsFromGemini } from "../utils/recommendation.service.js";

export const fetchRecommendationsForStudent = async (student) => {
  const mentors = await User.find({ role: "mentor" }).populate(
    "expertise links experience languages availability rating price verified"
  );
  const workshops = await Workshop.find().populate(
    "registeredStudents title description date time location type price language image rating topic capacity mentor"
  );
  return await getRecommendationsFromGemini(student, mentors, workshops);
};
