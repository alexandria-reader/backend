import express from 'express';
import { getAllTexts } from '../services/texts';

const router = express.Router();

router.get('/', async(_req, res) => {
  const texts = await getAllTexts();
  res.send(texts);
});

// router.post('/', async(req, res) => {
//   const { body } = req;
//   // const { title, text } = body;

//   // insert db logic here
//   // res.send(result);
// });

export default router;
