import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userServices from '../services/users';

const userRouter = express.Router();

function isJWTPayload(value: JwtPayload | String): value is JwtPayload {
  return (value as JwtPayload).id !== undefined;
}

userRouter.post('/', async (req, res) => {
  const {
    username, password, email, knownLanguageId, learnLanguageId,
  } = req.body;
  // eslint-disable-next-line max-len
  const newUser = await userServices.addNewUser(username, password, email, knownLanguageId, learnLanguageId);

  res.status(201).json(newUser);
});

userRouter.get('/', async (_req, res) => {
  const users = await userServices.selectAllUsers();
  res.send(users);
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

  const response = await userServices.updateUserPassword(userId, currentPassword, newPassword);

  res.json(response);
});

userRouter.delete('/:userId', async (req, res) => {
  // check user is logged in first
  const { userId } = req.params;
  const { password } = req.body;

  // add missing data check and test

  const deletedUser = await userServices.removeUser(userId, password);

  res.json(deletedUser);
});

// // set user languages
userRouter.put('/', async (req, res) => {
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

    const { currentKnownId, currentLearnId } = req.body;
    const updatedUser = await userServices
      .setUserLanguages(currentKnownId, currentLearnId, decodedToken.id);

    return res.json(updatedUser);
  }

  return res.status(401).json({ error: 'token missing or invalid' });
});

export default userRouter;
