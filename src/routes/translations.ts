import express from 'express';
import translations from '../services/translations';
import { Translation } from '../types';

const router = express.Router();


// router.get('/', async (_req, res) => {
//   const results = await translation.getAll();
//   res.send(results);
// });


router.get('/', async (_req, res) => {
  const { user } = res.locals;

  const results = await translations.getAllByUser(Number(user.id));
  res.json(results);
});


router.get('/:id', async (req, res) => {
  const translationId = Number(req.params.id);
  const result = await translations.getOne(translationId);
  res.send(result);
});


router.get('/word/:word/', async (req, res) => {
  const { user } = res.locals;

  const data = {
    word: req.params.word,
  };
  const word = decodeURIComponent(data.word);
  const result = await translations.getByWord(word, user.id);
  res.send(result);
});


router.get('/word/:word/target/:targetId', async (req, res) => {
  const data = {
    word: req.params.word,
    targetId: req.params.targetId,
  };
  const word = decodeURIComponent(data.word);
  const { targetId } = data;

  const translationRes = await translations.getAllByWordByLang(word, targetId);
  res.send(translationRes);
});


router.post('/', async (req, res) => {
  const { user } = res.locals;
  const {
    wordId,
    translation,
    targetLanguageId,
    context,
  } = req.body;

  const newTranslation = await translations.add(Number(wordId), translation, targetLanguageId);

  if (newTranslation.id) {
    await translations.addToUsersTranslations(Number(user.id), newTranslation.id, context);
  }

  res.send(newTranslation);
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  translations.remove(Number(id));
  res.status(204).send();
});


router.put('/translation/:id', async (req, res) => {
  const { translation } = req.body;
  const { id } = req.params;
  const updatedTranslation: Translation = await translations.update(Number(id), translation);

  const { user } = res.locals;
  const context = await translations.getUserTranslationContext(Number(user.id), Number(id));

  res.json({ ...updatedTranslation, context });
});


export default router;
