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

// Given word id, returns word information for a user
// Test by going running SELECT * FROM users_words; and matching users with words they might know
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

// Given target language id, return list of dictionaries available for the language
router.get('/source/:sourcelangId/target/:targetlangId', async (req, res) => {
  const data = {
    sourceLang: req.params.sourcelangId,
    targetLang: req.params.targetlangId,
  };
  const sourceId = data.sourceLang;
  const targetId = data.targetLang;
  const result = await translationService.getDictionaries(sourceId, targetId);
  res.send(result);
});

// Given word and target language, find all translations of the word, try word/1/target/de, or word/1/target/fr
router.get('/word/:wordId/target/:targetId', async (req, res) => {
  const data = {
    wordId: req.params.wordId,
    targetId: req.params.targetId,
  };
  const { wordId, targetId } = data;
  const translation = await translationService.getAllForOneWord(Number(wordId), targetId);
  res.send(translation);
});

router.post('/word/:wordId/lang/:langId/user/:userId', async (req, res) => {
  const request = req.body;
  const {
    wordId, translation, targetLanguageId,
  } = request;
  const transReq = await translationService.postOne(wordId, translation, targetLanguageId);
  res.send(transReq);
});

export default router;
