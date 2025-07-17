import { prisma } from './index.js';
import { Post, PostCreateInput } from '@repo/types';

/**
 * Create a post.
 * @param data The body of the new post.
 * @returns The new post.
 */
export const createPost = async (data: PostCreateInput): Promise<Post> => {
  return (await prisma.post.create({
    data,
  })) as Post;
};

/**
 * Get a post.
 * @param id post id.
 * @returns The post.
 */
export async function getPostById(id: string): Promise<Post> {
  return (await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      likes: true,
      media: true,
    },
  })) as Post;
}

/**
 *
 * @param authorId ID of the user from whom the posts will be obtained.
 * @returns Array of posts.
 */
export const getPostsByUser = async (authorId: string) => {
  return await prisma.post.findMany({ where: { authorId } });
};

/**
 * Update the specified post via id.
 * @param id The post id.
 * @param data The updated content. For now, the user can update only the content of the post.
 * @returns A version of the updated post.
 */
export const updatePost = async (
  id: string,
  data: {
    content?: string;
  },
) => {
  return await prisma.post.update({
    where: { id },
    include: {
      author: {
        omit: {
          password: true,
          email: true,
        },
      },
      media: {
        omit: {
          deleteHash: true,
        },
      },
    },
    data,
  });
};

export const deletePost = async (id: string) => {
  return await prisma.post.delete({ where: { id } });
};
