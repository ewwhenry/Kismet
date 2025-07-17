import { Router } from 'express';
import { getPosts, createPost } from '../controllers/posts.controller.js';
import authenticatedOnlyMiddleware from '../middlewares/authenticatedOnly.js';
import multer from '../middlewares/multer.js';

const posts: Router = Router();

posts.use(authenticatedOnlyMiddleware);

posts.get('/', getPosts);
posts.post('/', multer.array('media', 9), createPost);

export default posts;
