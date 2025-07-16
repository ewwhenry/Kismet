import { IRoute, Router } from 'express';
import posts from './posts.route.js';
import { createError, ErrorCodes } from '../utils/responses.js';
import routeMapping from '../utils/routeMapping.js';

const root: Router = Router();

const map = [...routeMapping('/posts', posts)];

root.use('/posts', posts);

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
