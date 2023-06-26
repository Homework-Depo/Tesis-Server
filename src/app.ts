import express from 'express';
import { routes } from './router';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
}));

routes(app);

export default app;