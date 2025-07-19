import express from "express";
import {
  createReviewController,
  deleteReviewController,
  getReviewsByTargetController,
} from "../controllers/review.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/",
  authMiddleware,
  roleCheck("student"),
  createReviewController
);

reviewRouter.get("/:targetType/:targetId", getReviewsByTargetController);
reviewRouter.delete("/:id", roleCheck("admin"), deleteReviewController);

export default reviewRouter;
