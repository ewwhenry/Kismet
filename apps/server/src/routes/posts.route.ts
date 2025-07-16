import { IRoute, Router } from 'express';
import { getPosts } from '../controllers/posts.controller.js';

const posts: Router = Router();

posts.get('/', getPosts);
posts.post('/', getPosts);

export default posts;
