import express from "express";
import {
  getStudentController,
  updateStudentController,
  getStudentCVsController,
  createStudentController,
  getRegisteredWorkshops,
} from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.js";
const studentRouter = express.Router();

studentRouter.use(authMiddleware);
// studentRouter.use(validateObjectId);

studentRouter.post("/", createStudentController);
studentRouter.get("/:id", getStudentController);
studentRouter.patch("/:id", updateStudentController);
studentRouter.get("/:id/cvs", getStudentCVsController);
studentRouter.get("/me/workshops", authMiddleware, getRegisteredWorkshops);

export default studentRouter;
