import express from "express";
import {
  getMentorsController,
  getMentorByIdController,
  createMentorController,
  updateMentorController,
  addAvailabilityController,
  removeAvailabilityController,
} from "../controllers/mentor.controller.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const mentorRouter = express.Router();
mentorRouter.get("/", getMentorsController);
mentorRouter.get("/:id", authMiddleware, getMentorByIdController);

mentorRouter.post(
  "/",
  authMiddleware,
  upload.single("mentorImage"),
  createMentorController
);
mentorRouter.put("/:id", authMiddleware, updateMentorController);

mentorRouter.post(
  "/availability/add",
  authMiddleware,
  addAvailabilityController
);
mentorRouter.post(
  "/availability/remove",
  authMiddleware,
  removeAvailabilityController
);

export default mentorRouter;
