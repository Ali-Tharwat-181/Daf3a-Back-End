import tryToCatch from "try-to-catch";
import Mentor from "../models/mentor.model.js";

export const getMentors = tryToCatch(async () => {
  const mentors = await Mentor.find().populate("user", "-password");
  return mentors;
});

export const getMentorById = tryToCatch(async (id) => {
  const mentor = await Mentor.findById(id).populate("user", "-password");
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  return mentor;
});

export const createMentor = tryToCatch(async (userId, body) => {
  const existingMentor = await Mentor.findOne({ user: userId });
  if (existingMentor) {
    throw new Error("Mentor already exists for this user");
  }
  return Mentor.create({ user: userId, ...body });
});

export const updateMentor = tryToCatch(async (id, userId, userRole, body) => {
  const mentor = await Mentor.findById(id);
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  if (mentor.user.toString() !== userId && userRole !== "mentor") {
    throw new Error("Unauthorized to update this mentor");
  }
  Object.assign(mentor, body);
  await mentor.save();
  return mentor;
});
