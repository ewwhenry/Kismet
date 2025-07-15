import Express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { ALLOWED_ORIGINS } from "./config.js";
import { createError, ErrorCodes } from "./utils/responses.js";
import root from "./routes/root.route.js";

const app: Application = Express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(morgan("dev"));

app.use("/", root);

app.get(/(\/)?.*/g, (_req, res) => {
  const error = createError({
    code: ErrorCodes.ENDPOINT_NOT_FOUND,
    message: "It looks like you're looking for an endpoint that doesn't exist!",
  });
  res.status(error.status).json(error);
});

export default app;
