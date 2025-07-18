import { RequestHandler } from 'express';
import {
  createCursorPaginatedResponse,
  createError,
  createSuccessResponse,
  ErrorCodes,
} from '../utils/responses.js';
import type { MediaCreateInput, PostCreateInput } from '@repo/types';
import {
  prisma,
  createPost as prismaCreatePost,
  createMedia,
  getPostById,
  deletePost as prismaDeletePost,
} from '@repo/db';
import { deleteImage, uploadImages } from '../utils/imgur.js';

export const getPosts: RequestHandler = async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  const take = Number(limit) + 1;

  const [cursorCreatedAt, cursorId] = cursor
    ? (cursor as string).split('_')
    : [undefined, undefined];

  const posts = await prisma.post.findMany({
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          createdAt_id: {
            createdAt: new Date(cursorCreatedAt!),
            id: cursorId!,
          },
        }
      : undefined,
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }, // asegura ordenamiento único
    ],
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
  });

  const hasNextPage = posts.length > Number(limit);
  const items = hasNextPage ? posts.slice(0, -1) : posts;

  const nextCursor = hasNextPage
    ? `${items[items.length - 1]!.createdAt.toISOString()}_${items[items.length - 1]!.id}`
    : null;

  return res.json({
    status: 200,
    message: 'Success',
    data: items,
    hasNextPage,
    nextCursor,
  });
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
  if (media && media.length > 0) {
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

    await createMedia(mediaObjects);
  }

  post = await getPostById(post.id);

  post.media;
  const message = createSuccessResponse(
    post,
    'Post successfully created!',
    200,
  );

  res.status(message.status).json(message);
};

export const deletePost: RequestHandler = async (req, res) => {
  let userId = (req as any).user.id;
  let postId = req.params.postId!;

  // Get the post to delete
  let post = await getPostById(postId);

  // If the author of the post is not the user that is performing the deletion, we return an error.
  if (post.authorId !== userId) {
    const error = createError({
      code: ErrorCodes.UNAUTHORIZED,
      message: 'You can not delete a post that is not yours.',
      details: {
        postId: postId,
      },
    });

    res.status(error.status).json(error);
    return;
  }

  await prismaDeletePost(postId);
  const deletionPromises = post.media!.map((image, index) =>
    deleteImage(image.deleteHash),
  );

  // We have to wait until all images are deleted from imgur.
  const results = await Promise.all(deletionPromises);

  if (
    results.map((x) => x.success).filter((x) => x === true).length ===
    post.media!.length
  ) {
    const message = createSuccessResponse(
      post,
      'Post deleted successfully',
      200,
    );

    res.status(message.status).json(message);
  }
};
