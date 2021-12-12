import express from 'express';
import texts from '../services/texts';

const router = express.Router();

router.get('/', async(_req, res) => {
  const allTexts = await texts.getAll();
  res.status(200).json(allTexts);
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  const textById = await texts.getById(id);
  res.status(200).json(textById);
});

router.post('/', async(_req, _res) => {
  // const { body } = req;
  // const { title, text } = body;
  // waiting for services
});

export default router;
