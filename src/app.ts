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
  origin: [
    "http://localhost",
    "http://localhost:5173",
    "http://34.209.204.1"
  ],
  credentials: true
}));

routes(app);

export default app;