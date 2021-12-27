import express from 'express';
import texts from '../services/texts';
import { Text } from '../types';
import { getUserFromToken } from '../utils/middleware';


const router: express.Router = express.Router();


router.get('/:langId/user', getUserFromToken, async(req, res): Promise<unknown> => {
  const { user } = res.locals;
  const languageId = req.params.langId;

  const allTexts: Array<Text> = await texts.getByUserAndLanguage(Number(user.id), languageId);
  return res.json(allTexts);
});


router.get('/', getUserFromToken, async(_req, res): Promise<unknown> => {
  const { user } = res.locals;

  const allTexts: Array<Text> = await texts.getByUser(Number(user.id));

  return res.json(allTexts);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const textById: Text = await texts.getById(id);
  res.json(textById);
});


router.post('/', getUserFromToken, async(req, res): Promise<unknown> => {
  const { user } = res.locals;

  const textData: Text = req.body;
  textData.userId = user.id;

  const text: Text = await texts.addNew(textData);

  return res.json(text);
});


router.put('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const textData = req.body;
  const updatedText: Text = await texts.update({ id, ...textData });
  res.json(updatedText);
});


router.delete('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const deletedText: Text = await texts.remove(id);
  res.status(204).json(deletedText);
});


export default router;
