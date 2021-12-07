import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Getting texts');
});

router.post('/', (_req, res) => {
  res.send('Posting texts');
});

export default router;
