import express from 'express';
import loginServices from '../services/login';

const loginRouter = express.Router();

export default loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const loggedInUser = await loginServices.login(email, password);

  res
    .status(200)
    .json(loggedInUser);
});
