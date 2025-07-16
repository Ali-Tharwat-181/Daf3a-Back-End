import {
  getStudentById,
  updateStudent,
  getStudentCVs,
  createStudent,
} from "../services/student.service.js";
import * as workshopService from "../services/workshop.service.js";

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
  try {
    const { id } = req.params;
    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStudentController = async (req, res) => {
  try {
    const result = await updateStudent(
      req.params.id,
      req.user._id,
      req.user.role,
      req.body
    );
    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentCVsController = async (req, res) => {
  try {
    const { id } = req.params;
    const cvs = await getStudentCVs(id);
    if (!cvs) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(cvs);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRegisteredWorkshops = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const workshops = await workshopService.getWorkshopsByStudent(studentId);
    return res.status(200).json({
      success: true,
      data: workshops,
      message: "Registered workshops fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
