import {
  createReportService,
  getAllReportsService,
  markReportResolvedService,
} from "../services/report.service.js";

export const createReport = async (req, res) => {
  try {
    const { reportedUser, booking, workshop, reason, message } = req.body;
    const reporter = req.user._id;

    const result = await createReportService({
      reporter,
      reportedUser,
      booking,
      workshop,
      reason,
      message,
    });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await getAllReportsService();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markReportResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await markReportResolvedService(id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
