import express from 'express';
import texts from '../services/texts';
import { Text } from '../types';

const router: express.Router = express.Router();

router.get('/', async(_req, res): Promise<void> => {
  const allTexts: Array<Text> = await texts.getAll();
  res.status(200).json(allTexts);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);

  const textById: Text | null = await texts.getById(id);
  res.status(200).json(textById);
});


router.post('/', async(req, res): Promise<void> => {
  const textData: Text = req.body;

  const newText: Text = await texts.addNew(textData);
  res.json(newText);
});


router.put('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const textData = req.body;

  const updatedText: Text | null = await texts.update({ id, ...textData });
  res.json(updatedText);
});


router.delete('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);

  const deletedText: Text | null = await texts.remove(id);
  res.json(deletedText);
});

export default router;
