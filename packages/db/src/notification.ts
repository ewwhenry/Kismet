import { NotificationType } from "../generated/prisma/index.js";
import { prisma } from "./index.js";

export const createNotification = async (data: {
  type: NotificationType;
  userId: string;
  fromUserId?: string;
  postId?: string;
}) => {
  return await prisma.notification.create({ data });
};

export const getNotificationsByUser = async (userId: string) => {
  return await prisma.notification.findMany({ where: { userId } });
};

export const markNotificationAsRead = async (id: string) => {
  return await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};
