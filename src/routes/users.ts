/* eslint-disable max-len */
import express from 'express';
import users from '../services/users';
import translations from '../services/translations';
import { getUserFromToken } from '../utils/middleware';


const userRouter = express.Router();


userRouter.post('/', async (req, res) => {
  const {
    username,
    password,
    email,
    knownLanguageId,
    learnLanguageId,
  } = req.body;

  const newUser = await users.addNew(username, password, email, knownLanguageId, learnLanguageId);

  res.status(201).json(newUser);
});


userRouter.post('/translation/:translationId', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { translationId, context } = req.body;

  await translations.addToUsersTranslations(Number(user.id), translationId, context);

  res.status(201).send();
});

userRouter.post('/confirm', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { password } = req.body;
  const response = await users.verifyPassword(user.id, password);

  if (response) {
    res.json({ match: 'true' });
  } else {
    res.json({ match: 'false' });
  }
});


userRouter.get('/', async (_req, res) => {
  const allUsers = await users.getAll();
  res.json(allUsers);
});


userRouter.get('/from-token', getUserFromToken, async (_req, res) => {
  const { user } = res.locals;

  const response = await users.getById(user.id);

  res.json(response);
});


userRouter.put('/change-password', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { currentPassword, newPassword } = req.body;

  const response = await users.updatePassword(user.id, currentPassword, newPassword);

  res.json(response);
});


userRouter.delete('/', getUserFromToken, async (_req, res) => {
  const { user } = res.locals;

  await users.remove(user.id);

  res.status(204).send();
});


// update user languages
userRouter.put('/set-languages', getUserFromToken, async (req, res) => {
  const { user } = res.locals;

  const { knownLanguageId, learnLanguageId } = req.body;

  const updatedUser = await users.setUserLanguages(
    knownLanguageId,
    learnLanguageId,
    user.id,
  );

  return res.json(updatedUser);
});

userRouter.put('/update', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { userName, email } = req.body;

  const updatedUser = await users.updateUserInfo(
    user.id,
    userName,
    email,
  );

  return res.json(updatedUser);
});


export default userRouter;
