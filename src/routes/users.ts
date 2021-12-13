import bcrypt from 'bcrypt';
import express from 'express';
import userServices from '../services/users';
import { User } from '../types';

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const { username, password, email } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const userData: User = {
    username,
    passwordHash,
    email,
  };

  const newUser = await userServices.addNewUser(userData);

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

  const updated = await userServices.updateUserPassword(userId, currentPassword, newPassword);

  if (updated) {
    res.json({ message: 'Your password has been updated' });
  } else {
    res.send({ message: 'Incorrect password' });
  }
});

userRouter.delete('/:userId', async (req, res) => {
  // check user is logged in first
  const { userId } = req.params;
  const { password } = req.body;

  const message = await userServices.removeUser(userId, password);

  res.json(message);
});

// set known language
userRouter.put('/:userId', async (_req, _res) => {

});

// add target language
userRouter.put('/:userId', async (_req, _res) => {

});

export default userRouter;
