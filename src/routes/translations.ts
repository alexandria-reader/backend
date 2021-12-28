import express from 'express';
import translation from '../services/translations';

const router = express.Router();


// router.get('/', async (_req, res) => {
//   const results = await translation.getAll();
//   res.send(results);
// });


router.get('/', async (_req, res) => {
  const { user } = res.locals;

  const results = await translation.getAllByUser(Number(user.id));
  res.json(results);
});

router.get('/:id', async (req, res) => {
  const translationId = Number(req.params.id);
  const result = await translation.getOne(translationId);
  res.send(result);
});

router.get('/word/:word/', async (req, res) => {
  const { user } = res.locals;

  const data = {
    word: req.params.word,
  };
  const word = decodeURIComponent(data.word);
  const result = await translation.getByWord(word, user.id);
  res.send(result);
});

router.get('/word/:word/target/:targetId', async (req, res) => {
  const data = {
    word: req.params.word,
    targetId: req.params.targetId,
  };
  const word = decodeURIComponent(data.word);
  const { targetId } = data;

  const translationRes = await translation.getAllByWordByLang(word, targetId);
  res.send(translationRes);
});

router.post('/', async (req, res) => {
  const data = {
    wordId: req.body.wordId,
    tran: req.body.translation,
    targetLang: req.body.targetLang,
  };

  const {
    wordId, tran, targetLang,
  } = data;
  const added = await translation.add(Number(wordId), tran, targetLang);
  res.send(added);
});

router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  const deleted = await translation.remove(Number(translationId));
  res.send(deleted);
});

router.put('/translation/:transId', async (req, res) => {
  const data = {
    trans: req.body.translation,
    id: req.params.transId,
  };
  const { trans, id } = data;
  const updated = await translation.update(trans, Number(id));
  res.send(updated);
});

export default router;
