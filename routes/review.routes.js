import express from "express";
import {
  createReviewController,
  getReviewsByTargetController,
} from "../controllers/review.controller.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/",
  authMiddleware,
  roleCheck("student"),
  createReviewController
);
reviewRouter.get(
  "/:targetType/:targetId",
  validateObjectId,
  getReviewsByTargetController
);

export default reviewRouter;
