import {
  generateProjectQRCode,
  checkInToProject,
  manualCheckIn,
  getAttendanceHistory,
  checkOutFromProject,
} from "../services/attendance.service.js";

export const generateProjectQRCodeController = async (req, res, next) => {
  try {
    const result = await generateProjectQRCode(
      req.params.projectId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "QR Code generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const checkInController = async (req, res, next) => {
  try {
    const attendance = await checkInToProject(req.body.token, req.user.id);

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const manualCheckInController = async (req, res, next) => {
  try {
    const attendance = await manualCheckIn(req.params.projectId, req.user.id);

    res.status(201).json({
      success: true,
      message: "Attendance submitted successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceHistoryController = async (req, res, next) => {
  try {
    const history = await getAttendanceHistory(req.user.id);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const checkOutController = async (req, res, next) => {
  try {
    const attendance = await checkOutFromProject(
      req.params.projectId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};
