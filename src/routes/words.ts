import express from 'express';
import wordService from '../services/words';

const router = express.Router();

router.get('/', async(_req, res) => {
  const words = await wordService.getAll();
  res.send(words);
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  const word = await wordService.getOne(id);
  res.send(word);
});

router.get('/:languageId/:userId', async(req, res) => {
  const languageId = Number(req.params.languageId);
  const userId = Number(req.params.userId);

  const words = await wordService.getSome(languageId, userId);
  res.send(words);
});

export default router;


