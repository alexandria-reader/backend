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

router.get('/:lang/user/:userId', async(req, res) => {
  const language = req.params.lang;
  const user = {
    user: req.params.userId,
  };
  const userId = Number(user.user);
  const words = await wordService.getSome(language, userId);
  res.send(words);
});

router.put('/word/:wordId/user/:userId', async(req, res) => {
  const { status } = req.body;
  const data = {
    wordId: req.params.wordId,
    userId: req.params.userId,
  };
  const { wordId, userId } = data;
  const word = await wordService.putOne(Number(wordId), Number(userId), status);
  res.send(word);
});

export default router;


