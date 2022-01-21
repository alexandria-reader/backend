import express from 'express';
import { ArticleData, extract } from 'article-parser';

const router: express.Router = express.Router();


router.post('/', async(req, res) => {
  const { url } = req.body;
  const timer = setTimeout(() => res.status(204).send(), 2000);

  try {
    const article: ArticleData = await extract(url);
    clearTimeout(timer);
    res.json(article);
  } catch (error) {
    console.trace(error);
  }
});

export default router;
