import {
  getStudentById,
  updateStudent,
  getStudentCVs,
} from "../services/student.service.js";

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
