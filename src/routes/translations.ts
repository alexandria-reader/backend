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

// test done
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

// wip test
router.put('/translation/:transId', async (req, res) => {
  const data = {
    trans: req.body.translation,
    id: req.params.transId,
  };
  const trans = data.trans;
  const id = data.id;
  // eslint-disable-next-line max-len
  const updated = await translation.update(trans, Number(id));
  if (updated) {
    res.send('Translation updated');
  } else {
    res.send('There is a problem with updated the translation');
  }
});

export default router;
