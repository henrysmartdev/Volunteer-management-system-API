import { getSystemAnalytics } from "../services/analytics.service.js";

export const getSystemAnalyticsController = async (req, res, next) => {
  try {
    const analytics = await getSystemAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
