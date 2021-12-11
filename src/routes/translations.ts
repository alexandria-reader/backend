import express from 'express';
import translation from '../services/translations';

const router = express.Router();

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

router.get('/word/:wordId/user/:userId', async (req, res) => {
  const data = {
    wordId: req.params.wordId,
    userId: req.params.userId,
  };
  const wordId = Number(data.userId);
  const userId = Number(data.userId);
  const result = await translation.getByWord(wordId, userId);
  res.send(result);
});

router.get('/word/:wordId/target/:targetId', async (req, res) => {
  const data = {
    wordId: req.params.wordId,
    targetId: req.params.targetId,
  };
  const { wordId, targetId } = data;
  const translationRes = await translation.getAllByWordByLang(Number(wordId), targetId);
  res.send(translationRes);
});

router.post('/user/:userId', async (req, res) => {
  const data = {
    userId: req.params.userId,
    wordId: req.body.wordId,
    tran: req.body.translation,
    targetLang: req.body.targetLang,
  };
  const {
    userId, wordId, tran, targetLang,
  } = data;
  // eslint-disable-next-line max-len
  const transReq = await translation.add(Number(userId), Number(wordId), tran, targetLang);
  res.send(transReq);
});

router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  // eslint-disable-next-line max-len
  const transReq = await translation.remove(Number(translationId));
  res.send(transReq);
});

router.put('/user/:userId', async (req, res) => {
  const data = {
    tran: req.body.translation,
    targetLang: req.body.targetLang,
  };
  const {
    tran, targetLang,
  } = data;
  // eslint-disable-next-line max-len
  const transReq = await translation.update(tran, targetLang);
  res.send(transReq);
});

export default router;
