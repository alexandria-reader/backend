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
  const result = await translation.getOneByTranslation(translationId);
  res.send(result);
});

router.get('/word/:wordId/user/:userId', async (req, res) => {
  const data = {
    word: req.params.wordId,
    user: req.params.userId,
  };
  const wordId = Number(data.word);
  const userId = Number(data.user);
  const result = await translation.getAllByWord(wordId, userId);
  res.send(result);
});

// Move to routing for webdictionaries?
// router.get('/pair/:pairId', async (req, res) => {
//   const data = {
//     pair: req.params.pairId,
//   };
//   const result = await translationService.getDictionaries(Number(data.pair));
//   res.send(result);
// });

router.get('/word/:wordId/target/:targetId', async (req, res) => {
  const data = {
    wordId: req.params.wordId,
    targetId: req.params.targetId,
  };
  const { wordId, targetId } = data;
  const translationRes = await translation.getAllForOneWord(Number(wordId), targetId);
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
  const transReq = await translation.addOneTranslation(Number(userId), Number(wordId), tran, targetLang);
  res.send(transReq);
});

router.put('/user/:userId', async (req, res) => {
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
  const transReq = await translation.updateOneTranslation(Number(userId), Number(wordId), tran, targetLang);
  res.send(transReq);
});

export default router;