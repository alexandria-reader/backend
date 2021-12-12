import express from 'express';
import texts from '../services/texts';

const router = express.Router();

router.get('/', async(_req, res) => {
  try {
    const allTexts = await texts.getAll();
    res.status(200).json(allTexts);
  } catch (error: any) {
    console.log(error.message || error);
    res.status(400).send(error.message || error);
  }
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  try {
    const textById = await texts.getById(id);
    res.status(200).json(textById);
  } catch (error: any) {
    console.log(error.message || error);
    res.status(400).send(error.message || error);
  }
});

router.post('/', async(_req, _res) => {
  // const { body } = req;
  // const { title, text } = body;
  // waiting for services
});

export default router;
