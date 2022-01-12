import express from 'express';
import languageServices from '../services/languages';

const languageRouter = express.Router();

languageRouter.get('/', async (_req, res) => {
  const languages = await languageServices.getAll();
  const cacheDuration = 60 * 60 * 24 * 7; // one week
  res.set('Cache-control', `public, max-age=${cacheDuration}`);
  res.send(languages);
});

export default languageRouter;
