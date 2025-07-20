import User from "../models/User.js";
import Workshop from "../models/Workshop.js";

import { getRecommendationsFromGemini } from "../utils/recommendation.service.js";

export const fetchRecommendationsForStudent = async (student) => {
  const mentors = await User.find({ role: "mentor" }); // basic list to show AI
  const workshops = await Workshop.find(); // basic list to show AI

  const { recommendedMentors, recommendedWorkshops } =
    await getRecommendationsFromGemini(student, mentors, workshops);

  const fullMentors = await User.find({ _id: { $in: recommendedMentors } });
  const fullWorkshops = await Workshop.find({
    _id: { $in: recommendedWorkshops },
  });

  return {
    recommendedMentors: fullMentors,
    recommendedWorkshops: fullWorkshops,
  };
};
