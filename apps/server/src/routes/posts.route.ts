import { Router } from 'express';
import {
  getPosts,
  createPost,
  deletePost,
} from '../controllers/posts.controller.js';
import authenticatedOnlyMiddleware from '../middlewares/authenticatedOnly.js';
import multer from '../middlewares/multer.js';

const posts: Router = Router();

posts.use(authenticatedOnlyMiddleware);

posts.get('/', getPosts);
posts.post('/', multer.array('media', 4), createPost);
posts.delete('/:postId', deletePost);

export default posts;
