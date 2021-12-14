import boom from '@hapi/boom';
import express from 'express';
import texts from '../services/texts';
import { Text } from '../types';

const router: express.Router = express.Router();

router.get('/', async(_req, res): Promise<void> => {
  const allTexts: Array<Text> = await texts.getAll();
  res.json(allTexts);
});


router.get('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);

  const textById: Text | null = await texts.getById(id);
  if (!textById) throw boom.notFound('There is no text with this id.');

  res.json(textById);
});


router.post('/', async(req, res): Promise<void> => {
  const textData: Text = req.body;

  const newText: Text | null = await texts.addNew(textData);
  if (!newText) throw boom.badRequest('Could not add new text.');

  res.status(201).json(newText);
});


router.put('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const textData = req.body;

  const updatedText: Text | null = await texts.update({ id, ...textData });
  if (!updatedText) throw boom.badRequest('Could not update text.');

  res.json(updatedText);
});


router.delete('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);

  const deletedText: Text | null = await texts.remove(id);
  if (!deletedText) throw boom.badRequest('Could not delete text.');

  res.status(204).json(deletedText);
});

export default router;
