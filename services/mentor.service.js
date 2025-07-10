import Mentor from "../models/Mentor.js";

export const getMentors = async () => {
  const mentors = await Mentor.find().populate("user", "-password");
  return mentors;
};

export const getMentorById = async (id) => {
  const mentor = await Mentor.findById(id).populate("user", "-password");
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  return mentor;
};

export const createMentor = async (userId, body) => {
  const existingMentor = await Mentor.findOne({ user: userId });
  if (existingMentor) {
    throw new Error("Mentor already exists for this user");
  }
  return Mentor.create({ user: userId, ...body });
};

export const updateMentor = async (id, userId, userRole, body) => {
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
};
