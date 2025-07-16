import { RequestHandler } from 'express';
import { createCursorPaginatedResponse } from '../utils/responses.js';
import { prisma } from '@repo/db';

export const getPosts: RequestHandler = async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  const take = Number(limit) + 1;

  const posts = await prisma.post.findMany({
    take,
    orderBy: { createdAt: 'desc' },
    cursor: cursor ? { id: cursor as string } : undefined,
    skip: cursor ? 1 : 0,
  });

  return res.json(createCursorPaginatedResponse(posts, Number(limit)));
};
