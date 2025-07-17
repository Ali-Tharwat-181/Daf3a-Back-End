import express from "express";
import {
  getStudentController,
  updateStudentController,
  getStudentCVsController,
  createStudentController,
  getRegisteredWorkshops,
  deleteCvController,
  uploadCvController,
} from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { uploadCv } from "../middlewares/upload.js";

const studentRouter = express.Router();

studentRouter.use(authMiddleware);

studentRouter.post("/", createStudentController);
studentRouter.get("/:id", getStudentController);
studentRouter.patch("/:id", updateStudentController);
studentRouter.get("/:id/cvs", getStudentCVsController);

studentRouter.post("/upload-cv", uploadCv.single("cv"), uploadCvController);
studentRouter.delete("/delete-cv", deleteCvController);

studentRouter.get("/me/workshops", authMiddleware, getRegisteredWorkshops);

export default studentRouter;
