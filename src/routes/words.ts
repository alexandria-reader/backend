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
  console.log(wordData, userId);

  const newWord: Word = await words.addNew(wordData);
  console.log(newWord);
  // res.send(newWord);
  if (newWord.id) {
    await words.addStatus(newWord.id, userId, 'learning');
    res.send(newWord);
  }
});


router.put('/word/:wordId/user/:userId', async(req, res): Promise<void> => {
  const { status } = req.body;
  const { wordId, userId } = req.params;
  const updatedStatus = await words.updateStatus(Number(wordId), Number(userId), status);
  res.send(updatedStatus);
});

export default router;