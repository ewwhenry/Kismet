import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { createError, ErrorCodes } from '../utils/responses.js';
import { CYPHER_KEY } from '../config.js';

const authenticatedOnlyMiddleware: RequestHandler = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    let error = createError({
      code: ErrorCodes.UNAUTHORIZED,
      message: 'Missing Authorization header.',
    });

    res.status(error.status).json(error);
    return;
  }

  let [type, token] = authorization.split(' ');

  if (!token || !type) {
    let error = createError({
      code: ErrorCodes.UNAUTHORIZED,
      message: 'Missing token type or token.',
    });

    res.status(error.status).json(error);
    return;
  }

  let decoded = jwt.verify(token, CYPHER_KEY);

  if (!decoded) {
    let error = createError({
      code: ErrorCodes.UNAUTHORIZED,
      message: 'Invalid token.',
    });

    res.status(error.status).json(error);
    return;
  }
  (req as any).user = decoded;
  next();
};

export default authenticatedOnlyMiddleware;
