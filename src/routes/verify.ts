import express from 'express';
import users from '../services/users';


const verifyRouter = express.Router();


verifyRouter.get('/:code/:token', async (req, res) => {
  const { code, token } = req.params;

  const verifiedUser = await users.verify(code, token);

  if (verifiedUser) res.redirect('https://tryalexandria.com/verified');

  res.status(404).send();
  // res.json(verifiedUser);
});


export default verifyRouter;
