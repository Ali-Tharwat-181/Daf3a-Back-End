import express from "express";
import {
  getStudent,
  updateStudent,
  getStudentCVs,
} from "../controllers/student.controller.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { authMiddleware } from "../middleware/auth.js";
const studentRouter = express.Router();

studentRouter.use(authMiddleware);
studentRouter.use(validateObjectId);

studentRouter.get("/:id", getStudent);
studentRouter.patch("/:id", updateStudent);
studentRouter.get("/:id/cvs", getStudentCVs);

export default studentRouter;
