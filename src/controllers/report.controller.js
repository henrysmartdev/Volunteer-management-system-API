import {
  getProjectAttendanceReport,
  getVolunteerHoursReport,
} from "../services/report.service.js";

export const getVolunteerHoursReportController = async (req, res, next) => {
  try {
    const report = await getVolunteerHoursReport();

    res.status(200).json({
      success: true,
      count: report.length,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectAttendanceReportController = async (req, res, next) => {
  try {
    const report = await getProjectAttendanceReport(
      req.params.projectId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
