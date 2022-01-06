import express from 'express';
import webdictionaries from '../services/webdictionaries';

const webdictionariesRouter = express.Router();

webdictionariesRouter.get('/source/:sourceId/target/:targetId', async (req, res) => {
  const { sourceId, targetId } = req.params;
  const webdictionaryList = await webdictionaries.getBySourceTarget(sourceId, targetId);
  res.json(webdictionaryList);
});

export default webdictionariesRouter;
