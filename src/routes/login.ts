import jwt from 'jsonwebtoken';
import express from 'express';
import userServices from '../services/users';

const loginRouter = express.Router();

export default loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.getUserByUsername(email, password);

  const userForToken = {
    email: user.email,
    id: user.id,
    username: user.username,
  };

  // token expires in one week
  const token = jwt.sign(
    userForToken,
    String(process.env.SECRET),
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  return res
    .status(200)
    .send({ token, username: user.username, email: user.email });
});
