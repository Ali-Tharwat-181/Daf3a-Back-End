import express from "express";
import {
  createReport,
  getAllReports,
  markReportResolved,
  getReports,
} from "../controllers/report.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const router = express.Router();

// Submit report (by student or mentor)
router.post("/", authMiddleware, createReport);

// Admin views all reports
router.get("/", authMiddleware, roleCheck("admin"), getAllReports);

router.get("/reportsforuser", authMiddleware, getReports);

router.patch(
  "/:id/resolve",
  authMiddleware,
  roleCheck("admin"),
  markReportResolved
);

export default router;
