import { prisma } from "../lib/prisma.js";

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};
