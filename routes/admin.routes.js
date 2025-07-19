import express from "express";
import {
  verifyMentorController,
  getAnalyticsController,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleCheck("admin"));

adminRouter.put("/mentors/:id/verify", verifyMentorController);

adminRouter.get("/analytics", getAnalyticsController);
export default adminRouter;
