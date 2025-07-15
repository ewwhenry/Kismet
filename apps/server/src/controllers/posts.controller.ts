import { RequestHandler } from "express";
import { examplePosts as posts } from "../constants/mocks.js";
import { createPaginatedResponse } from "../utils/responses.js";

export const getPosts: RequestHandler = (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 5;

  const totalItems = posts.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = posts.slice(start, end);

  return res.json(
    createPaginatedResponse(
      paginatedItems,
      totalItems,
      page,
      pageSize,
      "Posts retrieved successfully"
    )
  );
};
