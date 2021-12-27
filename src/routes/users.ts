/* eslint-disable max-len */
import express from 'express';
import users from '../services/users';
import { getUserFromToken } from '../utils/middleware';


const userRouter = express.Router();


userRouter.post('/', async (req, res) => {
  const {
    username, password, email, knownLanguageId, learnLanguageId,
  } = req.body;
  // eslint-disable-next-line max-len
  const newUser = await users.addNew(username, password, email, knownLanguageId, learnLanguageId);

  res.status(201).json(newUser);
});


userRouter.get('/', async (_req, res) => {
  const allUsers = await users.getAll();
  res.json(allUsers);
});


// reset password
userRouter.put('/:userId', async (req, res) => {
  // check user is logged in first
  const { userId } = req.params;
  const { password: currentPassword, newPassword } = req.body;
  // will add paramater checking later
  // if (!currentPassword) {
  //   throw boom.notAcceptable('You must submit your current password.');
  // } else if (!newPassword) {
  //   throw boom.notAcceptable('You must submit a new password.');
  // }

  const response = await users.updatePassword(userId, currentPassword, newPassword);

  res.json(response);
});


userRouter.delete('/:userId', async (req, res) => {
  // check user is logged in first
  const { userId } = req.params;
  const { password } = req.body;

  // add missing data check and test

  const deletedUser = await users.remove(userId, password);

  res.status(204).json(deletedUser);
});


// set user languages
userRouter.put('/', getUserFromToken, async (req, res) => {
  const { user } = res.locals;

  const { currentKnownLanguageId, currentLearnLanguageId } = req.body;
  const updatedUser = await users.setUserLanguages(
    currentKnownLanguageId,
    currentLearnLanguageId,
    user.id,
  );

  return res.json(updatedUser);
});


export default userRouter;
