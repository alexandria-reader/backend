import express from 'express';
import { extract } from 'article-parser';
// import boom from '@hapi/boom';
// import texts from '../services/texts';
// import { Text } from '../types';

const router: express.Router = express.Router();

router.post('/', async(req, res) => {
  // const { user } = res.locals;
  const { url } = req.body;
  const timer = setTimeout(() => res.status(204).send(), 2000);

  extract(url).then((article) => {
    clearTimeout(timer);
    res.json(article);
  }).catch((err) => {
    console.trace(err);
  });
});

export default router;
