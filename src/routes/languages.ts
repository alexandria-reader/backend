import express from 'express';
import languageServices from '../services/languages';

const languageRouter = express.Router();

// languageRouter.post('/', async (req, res) => {
//   const { username, password, email } = req.body;
//   const newUser = await userServices.addNewUser(username, password, email);

//   res.status(201).json(newUser);
// });

languageRouter.get('/', async (_req, res) => {
  const languages = await languageServices.getAll();
  res.send(languages);
});

export default languageRouter;
