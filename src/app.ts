import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import textsRouter from './routes/texts';
import translationsRouter from './routes/translations';
import usersRouter from './routes/users';
import wordsRouter from './routes/words';

import { errorMiddleware, notFoundMiddleware } from './utils/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/texts', textsRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/words', wordsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
