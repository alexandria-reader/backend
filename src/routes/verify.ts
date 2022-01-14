/* eslint-disable max-len */
import express from 'express';
import users from '../services/users';
import { getUserFromToken } from '../utils/middleware';
import { User } from '../types';

const verifyRouter = express.Router();


verifyRouter.get('/resend-email', getUserFromToken, async (_req, res) => {
  const { user } = res.locals;
  const fullUser = await users.getById(user.id, false) as User;
  if (!user.verified) {
    await users.sendVerificationEmail(fullUser.verificationCode, user.email, user.username);
  }
  res.send('Sent email again.');
});


verifyRouter.get('/:code/:token', async (req, res) => {
  const { code, token } = req.params;

  const verifiedUser = await users.verify(code, token);

  if (verifiedUser) res.redirect('https://tryalexandria.com/verify');

  res.status(404).send();
  // res.json(verifiedUser);
});


export default verifyRouter;
