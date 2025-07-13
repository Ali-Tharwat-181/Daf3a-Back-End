import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
} from "../services/mentor.service.js";

export const getMentorsController = async (req, res) => {
  try {
    const mentors = await getMentors();
    return res.status(200).json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentorByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await getMentorById(id, req.user);
    return res.status(200).json(mentor);
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

export const createMentorController = async (req, res) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({ error: "Only mentors can create profile" });
  }

  try {
    const mentor = await createMentor(req.user._id, req.body);
    return res.status(201).json(mentor);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateMentorController = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await updateMentor(
      id,
      req.user._id,
      req.user.role,
      req.body
    );
    return res.status(200).json(mentor);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
