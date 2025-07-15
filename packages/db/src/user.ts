import { prisma } from "./index.js";

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
}) => {
  return await prisma.user.create({ data });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    bio?: string;
    profilePicture?: string;
  }
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({ where: { id } });
};

export const followUser = async (userId: string, followId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      following: {
        connect: { id: followId },
      },
    },
  });
};

export const unfollowUser = async (userId: string, unfollowId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      following: {
        disconnect: { id: unfollowId },
      },
    },
  });
};
