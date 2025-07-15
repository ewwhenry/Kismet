import { prisma } from "./index.js";

export const createPost = async (data: {
  content: string;
  imageUrl?: string;
  authorId: string;
}) => {
  return await prisma.post.create({ data });
};

export const getPostById = async (id: string) => {
  return await prisma.post.findUnique({ where: { id } });
};

export const getPostsByUser = async (authorId: string) => {
  return await prisma.post.findMany({ where: { authorId } });
};

export const updatePost = async (
  id: string,
  data: {
    content?: string;
    imageUrl?: string;
  }
) => {
  return await prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id: string) => {
  return await prisma.post.delete({ where: { id } });
};
