import bcrypt from 'bcrypt';
import express from 'express';
import userServices from '../services/users'; // needs to be implemented
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
  const { userId } = req.params;
  const { password: currentPassword, newPassword } = req.body;

  const updated = await userServices.updateUserPassword(userId, currentPassword, newPassword);

  if (updated) {
    res.send('Your password has been updated');
  } else {
    res.send('Passwords do not match');
  }
});

// set known language
userRouter.put('/:userId', async (_req, _res) => {

});

// add target language
userRouter.put('/:userId', async (_req, _res) => {

});

export default userRouter;
