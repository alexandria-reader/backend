import express from 'express';
import translation from '../services/translations';

const router = express.Router();

router.get('/', async (_req, res) => {
  const results = await translation.getAll();
  res.send(results);
});

router.get('/user/:userId', async (req, res) => {
  const data = {
    userId: req.params.userId,
  };

  const results = await translation.getAllByUser(Number(data.userId));
  res.send(results);
});

router.get('/:id', async (req, res) => {
  const translationId = Number(req.params.id);
  const result = await translation.getOne(translationId);
  res.send(result);
});

router.get('/word/:word/user/:userId', async (req, res) => {
  const data = {
    word: req.params.word,
    userId: req.params.userId,
  };
  const word = decodeURIComponent(data.word);
  const userId = Number(data.userId);
  const result = await translation.getByWord(word, userId);
  res.send(result);
});

router.get('/word/:word/target/:targetId', async (req, res) => {
  const data = {
    word: req.params.word,
    targetId: req.params.targetId,
  };
  const word = decodeURIComponent(data.word);
  const targetId = data.targetId;

  const translationRes = await translation.getAllByWordByLang(word, targetId);
  res.send(translationRes);
});

router.post('/user/:userId', async (req, res) => {
  const data = {
    wordId: req.body.wordId,
    tran: req.body.translation,
    targetLang: req.body.targetLang,
  };
  const {
    wordId, tran, targetLang,
  } = data;
  // eslint-disable-next-line max-len
  const added = await translation.add(Number(wordId), tran, targetLang);
  res.send(added);
});

router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  // eslint-disable-next-line max-len
  const deleted = await translation.remove(Number(translationId));
  res.send(deleted);
});

router.put('/translation/:transId', async (req, res) => {
  const data = {
    trans: req.body.translation,
    id: req.params.transId,
  };
  const { trans, id } = data;
  // eslint-disable-next-line max-len
  const updated = await translation.update(trans, Number(id));
  res.send(updated);
});

export default router;
