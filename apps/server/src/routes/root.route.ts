import { IRoute, Router } from 'express';
import posts from './posts.route.js';
import auth from './auth.route.js';
import {
  createError,
  createSuccessResponse,
  ErrorCodes,
} from '../utils/responses.js';
import routeMapping from '../utils/routeMapping.js';
import authenticatedOnlyMiddleware from '../middlewares/authenticatedOnly.js';
import { getUserById } from '@repo/db';

const root: Router = Router();

const map = [...routeMapping('/posts', posts), ...routeMapping('/auth', auth)];

root.use('/posts', posts);
root.use('/auth', auth);

root.get('/users/@me', authenticatedOnlyMiddleware, async (req, res) => {
  let user = (req as any).user;

  let userData = await getUserById(user.id);
  delete (userData as any).password;
  // delete (userData as any).email;

  let response = createSuccessResponse(
    userData,
    'User successfully identifed',
    200,
  );

  res.status(response.status).json(response);
});

// This sends an 404 error when an endpoint doesnt exists. Its a fallback.
root.all(/(\/)?.*/g, (_req, res) => {
  const error = createError({
    code: ErrorCodes.ENDPOINT_NOT_FOUND,
    message: "It looks like you're looking for an endpoint that doesn't exist!",
    details: {
      sitemap: map,
    },
  });
  res.status(error.status).json(error);
});

export default root;
export { map };
