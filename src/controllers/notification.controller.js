import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

export const getNotificationsController = async (req, res, next) => {
  try {
    const notifications = await getNotifications(req.user.id);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController = async (req, res, next) => {
  try {
    const notification = await markNotificationAsRead(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsReadController = async (req, res, next) => {
  try {
    const updatedCount = await markAllNotificationsAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read`,
    });
  } catch (error) {
    next(error);
  }
};
