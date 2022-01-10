import express from 'express';
import webdictionaries from '../services/webdictionaries';

const webdictionariesRouter = express.Router();

webdictionariesRouter.get('/source/:sourceId/target/:targetId', async (req, res) => {
  const { sourceId, targetId } = req.params;
  const webdictionaryList = await webdictionaries.getBySourceTarget(sourceId, targetId);
  const cacheDuration = 60 * 60 * 24 * 7; // one week

  res.set('Cache-control', `public, max-age=${cacheDuration}`);
  res.json(webdictionaryList);
});

export default webdictionariesRouter;
