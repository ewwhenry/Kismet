import { RequestHandler } from 'express';
import {
  createCursorPaginatedResponse,
  createSuccessResponse,
} from '../utils/responses.js';
import type { MediaCreateInput, PostCreateInput } from '@repo/types';
import {
  prisma,
  createPost as prismaCreatePost,
  createMedia,
  getPostById,
} from '@repo/db';
import { uploadImages } from '../utils/imgur.js';

export const getPosts: RequestHandler = async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  const take = Number(limit) + 1;

  const posts = await prisma.post.findMany({
    take,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      likes: true,
      media: {
        omit: {
          deleteHash: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    cursor: cursor ? { id: cursor as string } : undefined,
    skip: cursor ? 1 : 0,
  });

  return res.json(createCursorPaginatedResponse(posts, Number(limit)));
};

export const createPost: RequestHandler = async (req, res) => {
  const authorId = (req as any).user.id;
  const { content } = req.body;
  const media = req.files as Express.Multer.File[];

  let postBody: PostCreateInput = {
    content,
    authorId,
  };

  // Here we create the post, and then, we create the Media.
  let post = await prismaCreatePost(postBody);

  // Uploading all the media files to imgur and retriving their metadata.
  let uploadResult = await uploadImages(media);

  // With the resultant information, we will create the Media objects.
  let mediaObjects = uploadResult.results.successful.map(
    (image) =>
      ({
        deleteHash: image.deletehash,
        postId: post.id,
        type: image.type,
        url: image.link,
        description: image.description,
      }) as MediaCreateInput,
  );

  let medias = await createMedia(mediaObjects);

  console.log('Post created!', { post, medias });

  post = await getPostById(post.id);

  post.media;
  const message = createSuccessResponse(
    post,
    'Post successfully created!',
    200,
  );

  res.status(message.status).json(message);
};
