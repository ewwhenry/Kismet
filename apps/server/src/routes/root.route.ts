import { Router } from "express";
import posts from "./posts.route.js";

const root: Router = Router();

root.use("/posts", posts);

export default root;
