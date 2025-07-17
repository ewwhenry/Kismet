import Express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ALLOWED_ORIGINS } from './config.js';
import root from './routes/root.route.js';

const app: Application = Express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  }),
);
app.use(morgan('dev'));
app.use(Express.json());
app.use(
  Express.urlencoded({
    extended: true,
  }),
);

// This handles all our routes.
app.use('/', root);

export default app;
