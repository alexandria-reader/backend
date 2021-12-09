import bcrypt from 'bcrypt';
import express from 'express';
import { selectAllUsers, addNewUser, updateUserPassword } from '../services/users'; // needs to be implemented
import { User } from '../types';

const userRouter = express.Router();
// const saltPassword = async function(password: string): Promise<string> {
//   const saltRounds = 10;
//   const passwordHash = await bcrypt.hash(password, saltRounds);
//   return passwordHash;
// };


userRouter.post('/', async (req, res, next) => {
  const { username, password, email } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser: User = {
    username,
    passwordHash,
    email,
  };

  try {
    const userCreated = await addNewUser(newUser);

    if (userCreated) {
      res.send(`User ${newUser.username} succesfully created`);
    } else {
      res.send('Something went wrong');
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get('/', async (_req, res) => {
  const users = await selectAllUsers();
  res.send(users);
});

// reset password
userRouter.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password: currentPassword, newPassword } = req.body;

  const updated = await updateUserPassword(userId, currentPassword, newPassword);

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
