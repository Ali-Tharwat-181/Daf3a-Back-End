import express from "express";
import {
  getMentorsController,
  getMentorByIdController,
  createMentorController,
  updateMentorController,
  addAvailabilityController,
  removeAvailabilityController,
  setMentorPriceController,
  getMentorAvailabilityController,
  getMentorAvailabilityMenotr,
  connectMentorToStripe,
} from "../controllers/mentor.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "./../middlewares/roleCheck.js";

const mentorRouter = express.Router();
mentorRouter.get("/", getMentorsController);

mentorRouter.get(
  "/availability",
  authMiddleware,
  getMentorAvailabilityController
);
mentorRouter.get(
  "/availability/:id",
  authMiddleware,
  getMentorAvailabilityMenotr
);

mentorRouter.get("/:id", authMiddleware, getMentorByIdController);

mentorRouter.post(
  "/",
  authMiddleware,
  roleCheck("mentor"),
  createMentorController
);
mentorRouter.put(
  "/:id",
  authMiddleware,
  roleCheck("mentor"),
  updateMentorController
);

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

mentorRouter.put("/mentor/set-price", authMiddleware, setMentorPriceController);


mentorRouter.post("/createStripeId", authMiddleware, connectMentorToStripe);

export default mentorRouter;
