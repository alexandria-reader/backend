/* eslint-disable max-len */
import express from 'express';
import words from '../services/words';
import { Word } from '../types';

const router = express.Router();

router.get('/', async(_req, res): Promise<void> => {
  const allWords: Array<Word> = await words.getAll();

  res.json(allWords);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id = Number(req.params.id);
  const wordById: Word = await words.getById(id);

  res.json(wordById);
});


router.get('/:langId/user/:userId', async(req, res): Promise<void> => {
  const { langId, userId } = req.params;
  const wordsByLanguageAndUser: Array<Word> = await words.getByLanguageAndUser(langId, Number(userId));

  res.json(wordsByLanguageAndUser);
});

router.get('/text/:textId/user/:userId/', async(req, res): Promise<void> => {
  const data = {
    textId: req.params.textId,
    userId: req.params.userId,
  };
  const textId: number = Number(data.textId);
  const userId: number = Number(data.userId);
  const wordListByUserText: Array<Word> = await words.getUserwordsInText(userId, textId, true);
  res.json(wordListByUserText);
});

router.post('/user/:userId', async(req, res): Promise<void> => {
  const wordData: Word = req.body;
  const userId: number = Number(req.params.userId);
  const newWord: Word | null = await words.addNew(wordData);

  if (newWord.id) {
    const newStatus = await words.addStatus(newWord.id, userId, 'learning');

    res.status(201).json({ ...newWord, status: newStatus });
  }
});


router.put('/word/:wordId/user/:userId', async(req, res): Promise<void> => {
  const { status } = req.body;
  const { wordId, userId } = req.params;
  const updatedStatus: string | null = await words.updateStatus(Number(wordId), Number(userId), status);

  res.send(updatedStatus);
});

router.delete('/word/:wordId', async(req, res): Promise<void> => {
  const id = req.params.wordId;
  const result = await words.remove(Number(id));

  res.status(204).json(result);
});

export default router;
