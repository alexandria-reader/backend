/* eslint-disable max-len */
import express from 'express';
import words from '../services/words';
import { Word } from '../types';

const router = express.Router();

router.get('/', async(_req, res): Promise<void> => {
  const allWords = await words.getAll();
  res.send(allWords);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id = Number(req.params.id);

  const wordById: Word = await words.getById(id);
  res.send(wordById);
});


router.get('/:langId/user/:userId', async(req, res): Promise<void> => {
  const { langId, userId } = req.params;

  const wordsByLanguageAndUser: Array<Word> = await words.getByLanguageAndUser(langId, Number(userId));
  res.send(wordsByLanguageAndUser);
});


router.post('/user/:userId', async(req, res): Promise<void> => {
  const wordData: Word = req.body;
  const userId: number = Number(req.params.userId);

  const newWord: Word = await words.addNew(wordData);

  if (newWord.id) {
    await words.addStatus(newWord.id, userId, 'learning');
    res.send(newWord);
  }
});


router.put('/:id/user/:userId', async(req, res): Promise<void> => {
  const { status } = req.body;
  const { id, userId } = req.params;

  const updatedWord = await words.updateStatus(Number(id), Number(userId), status);
  res.send(updatedWord);
});

export default router;
