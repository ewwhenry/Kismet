import { Router } from "express";
import { getPosts } from "../controllers/posts.controller.js";

const posts: Router = Router();

posts.get("/", getPosts);

export default posts;
