import { PrismaClient } from '../generated/prisma/index.js';

export const prisma = new PrismaClient();

export * from './user.js';
export * from './post.js';
export * from './like.js';
export * from './comment.js';
export * from './match.js';
export * from './notification.js';
export * from './media.js';
