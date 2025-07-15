import { prisma } from "./index.js";

export const likePost = async (userId: string, postId: string) => {
  return await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });
};

export const unlikePost = async (userId: string, postId: string) => {
  return await prisma.like.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};

export const getLikesByPost = async (postId: string) => {
  return await prisma.like.findMany({ where: { postId } });
};
