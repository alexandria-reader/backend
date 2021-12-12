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

// test done
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
  const added = await translation.add(Number(userId), Number(wordId), tran, targetLang);
  if (added) {
    res.send('New translation added');
  } else {
    res.send('There is a problem with adding the translation');
  }
});

// WIP testing
router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  // eslint-disable-next-line max-len
  const deleted = await translation.remove(Number(translationId));
  if (deleted) {
    res.send('Translation deleted');
  } else {
    res.send('There is a problem with deleting the translation');
  }
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
