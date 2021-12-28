import express from 'express';
import languageServices from '../services/languages';

const languageRouter = express.Router();

languageRouter.get('/', async (_req, res) => {
  const languages = await languageServices.getAll();
  res.send(languages);
});

export default languageRouter;
