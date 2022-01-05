/* eslint-disable max-len */
import express from 'express';
import words from '../services/words';
import { Word, UserWord } from '../types';

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


router.get('/language/:langId', async(req, res): Promise<void> => {
  const { user } = res.locals;

  const { langId } = req.params;
  const userwordsInLanguage: Array<UserWord> = await words.getUserwordsByLanguage(langId, Number(user.id));

  res.json(userwordsInLanguage);
});


router.get('/text/:textId/language/:langId', async(req, res): Promise<void> => {
  const { user } = res.locals;

  const { textId, langId } = req.params;

  const userwordsInText: Array<UserWord> = await words.getUserwordsInText(Number(user.id), Number(textId), langId, true);
  res.json(userwordsInText);
});


router.post('/', async(req, res): Promise<void> => {
  const { user } = res.locals;
  const userWordData: UserWord = req.body;

  const newUserWord = await words.addNewUserWord(user, userWordData);

  res.status(201).json(newUserWord);
});


router.put('/:wordId', async(req, res): Promise<void> => {
  const { user } = res.locals;
  const { wordId } = req.params;
  const { status } = req.body;

  if (status) {
    const updatedStatus: string = await words.updateStatus(Number(wordId), Number(user.id), status);
    res.send(updatedStatus);
  } else {
    await words.removeUserWord(Number(wordId), Number(user.id));
    res.status(204).send();
  }
});

router.delete('/:wordId', async(req, res): Promise<void> => {
  const id = req.params.wordId;
  const result = await words.remove(Number(id));

  res.status(204).json(result);
});

export default router;
