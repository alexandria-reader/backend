/* eslint-disable max-len */
import boom from '@hapi/boom';
import express from 'express';
import words from '../services/words';
import { Word } from '../types';

const router = express.Router();

router.get('/', async(_req, res): Promise<void> => {
  const allWords: Array<Word> = await words.getAll();
  res.send(allWords);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id = Number(req.params.id);

  const wordById: Word | null = await words.getById(id);
  if (!wordById) throw boom.notFound('There is no word with this id.');

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

  const newWord: Word | null = await words.addNew(wordData);
  if (!newWord) throw boom.badRequest('Could not add word.');

  if (newWord.id) {
    const newStatus = await words.addStatus(newWord.id, userId, 'learning');
    if (!newStatus) throw boom.badRequest('Could not connect new word to user.');
    res.status(201).send({ ...newWord, status: newStatus });
  }
});


router.put('/word/:wordId/user/:userId', async(req, res): Promise<void> => {
  const { status } = req.body;
  const { wordId, userId } = req.params;

  const updatedStatus: string | null = await words.updateStatus(Number(wordId), Number(userId), status);
  if (!updatedStatus) throw boom.badRequest('Could not update word\'s status.');

  res.send(updatedStatus);
});

router.delete('/word/:wordId', async(req, res): Promise<void> => {
  const id = req.params.wordId;
  const result = await words.remove(Number(id));
  if (result) res.sendStatus(204);
});

export default router;
