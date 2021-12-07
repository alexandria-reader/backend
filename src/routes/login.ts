import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../services/users';

const loginRouter = express.Router();

loginRouter.post('/', async function(request, response) => {
  const { body } = request;

  // User needs to be implemented
  // const user = await User.findOne({ username: body.username }) 
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password';
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    // { expiresIn: 60*60*24 }
  );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});