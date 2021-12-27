import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import texts from '../services/texts';
import { Text } from '../types';

const router: express.Router = express.Router();


function isJWTPayload(value: JwtPayload | String): value is JwtPayload {
  return (value as JwtPayload).id !== undefined;
}


router.get('/', async(req, res): Promise<unknown> => {
  const authorization = req.get('authorization');

  let token = '';
  if (authorization) {
    token = authorization.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET || 'secret');

  if (isJWTPayload(decodedToken)) {
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const allTexts: Array<Text> = await texts.getByUser(Number(decodedToken.id));
    return res.json(allTexts);
  }

  return res.status(401).json({ error: 'token missing or invalid' });
});


router.get('/:id', async(req, res): Promise<void> => {
  const id: number = Number(req.params.id);
  const textById: Text = await texts.getById(id);
  res.json(textById);
});


router.post('/', async(req, res): Promise<unknown> => {
  const authorization = req.get('authorization');

  let token = '';
  if (authorization) {
    token = authorization.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET || 'secret');

  if (isJWTPayload(decodedToken)) {
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }
    const textData: Text = req.body;
    textData.userId = decodedToken.id;

    const text: Text = await texts.addNew(textData);
    return res.json(text);
  }

  return res.status(401).json({ error: 'token missing or invalid' });
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
