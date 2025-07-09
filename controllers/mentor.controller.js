import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
} from "../services/mentor.service.js";
import tryToCatch from "try-to-catch";

export const getMentorsController = tryToCatch(async (req, res) => {
  const [error, mentors] = await getMentors();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(mentors);
});

export const getMentorByIdController = tryToCatch(async (req, res) => {
  const { id } = req.params;
  const [error, mentor] = await getMentorById(id);
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  return res.status(200).json(mentor);
});

export const createMentorController = tryToCatch(async (req, res) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({ error: "Only mentors can create profile" });
  }
  const [error, mentor] = await createMentor(req.user._id, req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(mentor);
});

export const updateMentorController = tryToCatch(async (req, res) => {
  const { id } = req.params;
  const [error, mentor] = await updateMentor(
    id,
    req.user._id,
    req.user.role,
    req.body
  );

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json(mentor);
});
