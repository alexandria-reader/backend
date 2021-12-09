import express from 'express';
import words from '../services/words';

const router = express.Router();

router.get('/', async(_req, res) => {
  const allWords = await words.getAll();
  res.send(allWords);
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  const wordById = await words.getById(id);
  res.send(wordById);
});

router.get('/:languageId/:userId', async(req, res) => {
  const languageId = Number(req.params.languageId);
  const userId = Number(req.params.userId);

  const wordsByLanguageAndUser = await words.getByLanguageAndUser(languageId, userId);
  res.send(wordsByLanguageAndUser);
});

export default router;


