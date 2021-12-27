import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import users from '../services/users';


const userRouter = express.Router();


function isJWTPayload(value: JwtPayload | String): value is JwtPayload {
  return (value as JwtPayload).id !== undefined;
}


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

    const { currentKnownLanguageId, currentLearnLanguageId } = req.body;
    const updatedUser = await users
      .setUserLanguages(currentKnownLanguageId, currentLearnLanguageId, decodedToken.id);

    return res.json(updatedUser);
  }

  return res.status(401).json({ error: 'token missing or invalid' });
});


export default userRouter;
