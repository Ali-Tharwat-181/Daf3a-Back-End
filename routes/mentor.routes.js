import express from "express";
import {
  getMentorsController,
  getMentorByIdController,
  createMentorController,
  updateMentorController,
} from "../controllers/mentor.controller.js";
import authMiddleware from "../middleware/auth.js";
import validateObjectId from "../middleware/validateObjectId.js";
import upload from "./../middleware/upload";

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
