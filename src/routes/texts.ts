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

router.post('/', async(_req, _res): Promise<void> => {
  // const { body } = req;
  // const { title, text } = body;
  // waiting for services
});

export default router;
