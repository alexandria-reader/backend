import express from 'express';
import textService from '../services/texts';

const router = express.Router();

router.get('/', async(_req, res) => {
  const texts = await textService.getAll();
  res.send(texts);
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  const text = await textService.getOne(id);
  res.send(text);
});

router.post('/', async(req, _res) => {
  const { body } = req;
  // const { title, text } = body;
  // waiting for services
});

export default router;
