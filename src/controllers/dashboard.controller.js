import { getProjectDashboard } from "../services/dashboard.service.js";

export const getProjectDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getProjectDashboard(
      req.params.projectId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
