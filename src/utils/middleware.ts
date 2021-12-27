/* eslint-disable max-len */
import jwt, { Secret } from 'jsonwebtoken';
import boom from '@hapi/boom';
import type { Response, NextFunction } from 'express';
import type { RequestWithUserAuth } from '../types';
import users from '../services/users';


export function extractToken(req: RequestWithUserAuth, _res: Response, next: NextFunction) {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  next();
}


export async function getUserFromToken(req: RequestWithUserAuth, _res: Response, next: NextFunction) {
  if (!req.token) throw boom.unauthorized('token missing');

  const decodedToken = jwt.verify(req.token, process.env.SECRET as Secret);

  if (typeof decodedToken !== 'string') {
    if (!decodedToken.id) throw boom.unauthorized('token invalid');

    const userById = await users.getUserById(decodedToken.id);
    req.user = userById;
  }

  next();
}
