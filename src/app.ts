import express from 'express';
import cors from 'cors';
import config from './lib/config';

import textsRouter from './routes/texts';
import translationsRouter from './routes/translations';
import usersRouter from './routes/users';
import wordsRouter from './routes/words';
// import { unknownEndpoint } from './utils/middleware';

const app = express();
app.use(cors());
app.use(express.json());

const { PORT, HOST } = config;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/texts', textsRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/words', wordsRouter);
// app.use(unknownEndpoint);

app.listen(Number(PORT), String(HOST), () => {
  console.log(`That word-learn app is listening on port ${PORT} of ${HOST}.`);
});

export default app;
