import {
  getStudentById,
  updateStudent,
  getStudentCVs,
  createStudent,
  uploadStudentCv,
  deleteStudentCv,
} from "../services/student.service.js";
import * as workshopService from "../services/workshop.service.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

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
    // Map to objects with both stored and original names
    const files = cvs.map((cv) => {
      if (typeof cv === "object" && cv.stored && cv.original) {
        return { stored: cv.stored, original: cv.original };
      } else {
        // fallback for old entries: extract stored name, use as original
        const stored = typeof cv === "string" ? cv : "";
        const filename = stored.split(/[/\\]/).pop();
        return { stored, original: filename };
      }
    });
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadCvController = async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "student_cvs",
    });

    fs.unlinkSync(req.file.path); // Clean up local file

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCvController = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) throw new Error("public_id is required");

    await cloudinary.uploader.destroy(public_id, { resource_type: "raw" });

    res.status(200).json({ success: true, message: "CV deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(400).json({ success: false, message: err.message });
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
