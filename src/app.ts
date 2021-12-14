import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import textsRouter from './routes/texts';
import translationsRouter from './routes/translations';
import usersRouter from './routes/users';
import wordsRouter from './routes/words';

import { notFoundHandler, generalErrorHandler } from './utils/errorHandlers';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/texts', textsRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/words', wordsRouter);

app.use([notFoundHandler, generalErrorHandler]);

export default app;
