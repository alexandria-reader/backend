import express from 'express';
import userServices from '../services/users';

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = await userServices.addNewUser(username, password, email);

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

// // set known language
// userRouter.put('/:userId', async (_req, _res) => {

// });

// // add target language
// userRouter.put('/:userId', async (_req, _res) => {

// });

export default userRouter;
