import {
  getStudentById,
  updateStudent,
  getStudentCVs,
  createStudent,
} from "../services/student.service.js";

export const createStudentController = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can create profile" });
  }

  try {
    const student = await createStudent(req.user._id, req.body);
    return res.status(201).json(student);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentController = async (req, res) => {
  const { id } = req.params;
  const student = await getStudentById(id);
  res.status(200).json(student);
};

export const updateStudentController = async (req, res) => {
  const result = await updateStudent(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  if (!result) {
    return res.status(404).json({ message: "Student not found" });
  }
  if (result === false) {
    return res.status(403).json({
      message: "Unauthorized: Only students can update their profile",
    });
  }
  res.status(200).json(result);
};

export const getStudentCVsController = async (req, res) => {
  const { id } = req.params;
  const cvs = await getStudentCVs(id);
  if (!cvs) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.status(200).json(cvs);
};
