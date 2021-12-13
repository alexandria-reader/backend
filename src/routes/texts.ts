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

  const textById: Text = await texts.getById(id);
  res.status(200).json(textById);
});

router.post('/', async(req, res): Promise<void> => {
  const { body } = req;
  const response = await texts.addNew(body);
  res.json(response);
});

router.put('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);

  const { body } = req;
  const response = await texts.update({ id, ...body });
  res.json(response);
});

export default router;
