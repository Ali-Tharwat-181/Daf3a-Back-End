import express from "express";
import {
  getAllMentorsController,
  verifyMentorController,
  deleteReviewController,
  getAnalyticsController,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleCheck("admin"));

adminRouter.get("/mentors", getAllMentorsController);
adminRouter.put("/mentors/:id/verify", verifyMentorController);
adminRouter.delete("/reviews/:id", deleteReviewController);
adminRouter.get("/analytics", getAnalyticsController);
export default adminRouter;
