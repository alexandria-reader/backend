import express from 'express';
import texts from '../services/texts';
import { Text } from '../types';


const router: express.Router = express.Router();


router.get('/language/:langId/', async(req, res): Promise<void> => {
  const { user } = res.locals;
  const languageId = req.params.langId;

  const allTexts: Array<Text> = await texts.getByUserAndLanguage(Number(user.id), languageId);
  res.json(allTexts);
});


router.get('/:id', async(req, res): Promise<void> => {
  const { user } = res.locals;

  const id: number = Number(req.params.id);
  const textById: Text = await texts.getById(id);

  const cacheDuration = 60 * 60 * 24 * 7; // one week

  if (textById.userId === user.id) {
    res.set('Cache-control', `public, max-age=${cacheDuration}`);
    res.json(textById);
  } else {
    res.status(404).send();
  }
});


router.get('/', async(_req, res): Promise<void> => {
  const { user } = res.locals;

  const textsByUser: Array<Text> = await texts.getByUser(Number(user.id));

  res.json(textsByUser);
});


router.post('/', async(req, res): Promise<void> => {
  const { user } = res.locals;

  if (user.verified === true) {
    const textData: Text = req.body;
    textData.userId = user.id;

    const text: Text = await texts.addNew(textData);

    res.json(text);
  }

  res.status(406).send();
});


router.put('/:id', async(req, res): Promise<void> => {
  const { user } = res.locals;

  const id: number = Number(req.params.id);
  const textData = req.body;

  if (textData.userId === user.id) {
    const updatedText: Text = await texts.update({ id, ...textData });
    res.json(updatedText);
  } else {
    res.status(406).send();
  }
});


router.delete('/:id', async(req, res): Promise<void> => {
  const { user } = res.locals;
  const id: number = Number(req.params.id);
  const toBeDeleted = await texts.getById(id);

  if (toBeDeleted.userId === user.id) {
    await texts.remove(id);
    res.status(204).send();
  } else {
    res.status(406).send();
  }
});


export default router;
