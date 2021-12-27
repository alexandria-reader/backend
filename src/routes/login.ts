import jwt from 'jsonwebtoken';
import express from 'express';
import loginServices from '../services/login';

const loginRouter = express.Router();

export default loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await loginServices.verifyLoginDetails(email, password);

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

  res
    .status(200)
    .send({
      token,
      username: user.username,
      email: user.email,
      current_known_language_id: user.current_known_language_id,
      current_learn_language_id: user.current_learn_language_id,
    });
});
