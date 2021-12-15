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
  console.log(result);
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
  // if (added) {
  //   res.send('New translation added');
  // } else {
  //   res.send('There is a problem with adding the translation');
  // }
  res.send(added);
});

router.delete('/:translationId', async (req, res) => {
  const { translationId } = req.params;
  // eslint-disable-next-line max-len
  const deleted = await translation.remove(Number(translationId));
  // if (deleted) {
  //   res.send('Translation deleted');
  // } else {
  //   res.send('There is a problem with deleting the translation');
  // }
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
  // if (updated) {
  //   res.send('Translation updated');
  // } else {
  //   res.send('There is a problem with updated the translation');
  // }
  res.send(updated);
});

export default router;
