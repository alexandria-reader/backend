import bcrypt from 'bcrypt';
import express from 'express';
import { selectAllUsers } from '../services/users'; // needs to be implemented

const userRouter = express.Router();

userRouter.post('/', async (_req, res) => {
  // const { body } = req;

  // const saltRounds = 10;
  // const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // const user = new User({ // User needs to be implemented
  //   username: body.username,
  //   passwordHash,
  // });

  // const savedUser = await user.save();

  // res.json(savedUser);

  res.send('Creating user');
});

userRouter.get('/', async (_req, res) => {
  const users = await selectAllUsers();
  res.send(users);
});

export default userRouter;
