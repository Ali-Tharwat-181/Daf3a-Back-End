import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getStudentRecommendations } from "../controllers/ai.controller.js";

const router = express.Router();

router.get(
  "/student/recommendations",
  authMiddleware,
  getStudentRecommendations
);

export default router;
