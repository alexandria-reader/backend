import express from 'express';
import translations from '../services/translations';

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

  const newTranslation = await translation.add(Number(wordId), translation, targetLanguageId);

  await translations.addToUsersTranslations(Number(user.id), newTranslation.id, context);

  res.send(newTranslation);
});


router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  const deleted = await translations.remove(Number(translationId));
  res.send(deleted);
});


router.put('/translation/:transId', async (req, res) => {
  const data = {
    trans: req.body.translation,
    id: req.params.transId,
  };
  const { trans, id } = data;
  const updated = await translations.update(trans, Number(id));
  res.send(updated);
});


export default router;
