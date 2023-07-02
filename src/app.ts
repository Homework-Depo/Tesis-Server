import express from 'express';
import { routes } from './router';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(morgan('dev'));
app.use(cors({
  origin: `${frontendUrl}`,
  credentials: true
}));

routes(app);

export default app;