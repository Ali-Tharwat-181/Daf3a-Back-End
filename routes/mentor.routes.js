import express from "express";
import {
  getMentorsController,
  getMentorByIdController,
  createMentorController,
  updateMentorController,
} from "../controllers/mentor.controller.js";
import authMiddleware from "../middlewares/auth.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import upload from "../middlewares/upload.js";

const mentorRouter = express.Router();
mentorRouter.get("/", getMentorsController);
mentorRouter.get(
  "/:id",
  authMiddleware,
  validateObjectId,
  getMentorByIdController
);
mentorRouter.post(
  "/",
  authMiddleware,
  upload.single("mentorImage"),
  createMentorController
);
mentorRouter.put(
  "/:id",
  authMiddleware,
  validateObjectId,
  updateMentorController
);

export default mentorRouter;
