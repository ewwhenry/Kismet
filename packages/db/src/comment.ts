import { prisma } from "./index.js";

export const createComment = async (data: {
  text: string;
  userId: string;
  postId: string;
}) => {
  return await prisma.comment.create({ data });
};

export const getCommentsByPost = async (postId: string) => {
  return await prisma.comment.findMany({ where: { postId } });
};

export const deleteComment = async (id: string) => {
  return await prisma.comment.delete({ where: { id } });
};
