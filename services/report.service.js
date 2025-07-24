// services/report.service.js
import Report from "../models/Report.js";

export const createReportService = async ({
  reporter,
  reportedUser,
  booking,
  workshop,
  reason,
  message,
}) => {
  const newReport = new Report({
    reporter,
    reportedUser,
    booking,
    workshop,
    reason,
    message,
  });

  await newReport.save();
  return { message: "Report submitted." };
};

export const getAllReportsService = async () => {
  const reports = await Report.find()
    .populate("reporter", "name role")
    .populate("reportedUser", "name role")
    .populate("booking")
    .populate("workshop");

  return reports;
};

export const getReportsService = async ({
  reporter,
  booking,
  workshop,
  reportedUser,
}) => {
  const query = {};
  if (reporter) query.reporter = reporter;
  if (reportedUser) query.reportedUser = reportedUser;
  if (booking) query.booking = booking;
  if (workshop) query.workshop = workshop;

  const reports = await Report.find(query)
    .populate("reporter", "name role")
    .populate("reportedUser", "name role")
    .populate("booking");

  return reports;
};

export const markReportResolvedService = async (reportId) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new Error("Report not found.");
  }

  if (report.status === "resolved") {
    throw new Error("Report is already resolved.");
  }

  report.status = "resolved";
  await report.save();

  return { message: "Report marked as resolved." };
};
