import Notification from "../models/Notification.js";

export const createNotifications = async (
  userIds,
  title,
  message,
  type,
  transaction,
) => {
  const notifications = userIds.map((userId) => ({
    userId,
    title,
    message,
    type,
  }));

  return Notification.bulkCreate(notifications, {
    transaction,
  });
};

export const getNotifications = async (userId) => {
  return Notification.findAll({
    where: { userId },
    order: [
      ["isRead", "ASC"], // unread first
      ["createdAt", "DESC"], // newest first
    ],
  });
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  const [updatedCount] = await Notification.update(
    {
      isRead: true,
    },
    {
      where: {
        userId,
        isRead: false,
      },
    },
  );

  return updatedCount;
};
