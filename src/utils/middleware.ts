/* eslint-disable max-len */
import jwt, { Secret } from 'jsonwebtoken';
import boom from '@hapi/boom';
import type { Request, Response, NextFunction } from 'express';
import users from '../services/users';


export function extractToken(req: Request, res: Response, next: NextFunction) {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    res.locals.token = authorization.substring(7);
  }

  next();
}


export async function getUserFromToken(_req: Request, res: Response, next: NextFunction) {
  if (!res.locals.token) throw boom.unauthorized('token missing');

  const decodedToken = jwt.verify(res.locals.token, process.env.SECRET as Secret);

  if (typeof decodedToken !== 'string') {
    if (!decodedToken.id) throw boom.unauthorized('token invalid');

    const userById = await users.getById(decodedToken.id);
    res.locals.user = userById;
  }

  next();
}
