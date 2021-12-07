import express from 'express';
import cors from 'cors';
import textsRouter from './routes/texts';
import translationsRouter from './routes/translations';
import usersRouter from './routes/users';
// import { unknownEndpoint } from './utils/middleware';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/texts', textsRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/users', usersRouter);
// app.use('/api/users', usersRouter);
// app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
