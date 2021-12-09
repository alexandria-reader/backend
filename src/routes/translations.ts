import express from 'express';
import translationService from '../services/translations';

const router = express.Router();

router.get('/', async (_req, res) => {
  const results = await translationService.getAll();
  res.send(results);
});

router.get('/:id', async (req, res) => {
  const translationId = Number(req.params.id);
  const result = await translationService.getOne(translationId);
  res.send(result);
});

router.get('/word/:wordId/user/:userId', async (req, res) => {
  const data = {
    word: req.params.wordId,
    user: req.params.userId,
  };
  const wordId = Number(data.word);
  const userId = Number(data.user);
  const result = await translationService.getSome(wordId, userId);
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
  const translation = await translationService.getAllForOneWord(Number(wordId), targetId);
  res.send(translation);
});

router.post('/user/:userId', async (req, res) => {
  const data = {
    userId: req.params.userId,
    wordId: req.body.wordId,
    translation: req.body.translation,
    targetLang: req.body.targetLang,
  };
  const {
    userId, wordId, translation, targetLang,
  } = data;
  // eslint-disable-next-line max-len
  const transReq = await translationService.postOne(Number(userId), Number(wordId), translation, targetLang);
  res.send(transReq);
});

router.put('/user/:userId', async (req, res) => {
  const data = {
    userId: req.params.userId,
    wordId: req.body.wordId,
    translation: req.body.translation,
    targetLang: req.body.targetLang,
  };
  const {
    userId, wordId, translation, targetLang,
  } = data;
  // eslint-disable-next-line max-len
  const transReq = await translationService.postOne(Number(userId), Number(wordId), translation, targetLang);
  res.send(transReq);
});

export default router;
