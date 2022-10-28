/* eslint-disable max-len */
import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import users from '../services/users';

export const extractToken = function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    res.locals.token = authorization.substring(7);
  }

  next();
};

const isJWTPayload = function(
  value: JwtPayload | String
): value is JwtPayload {
  return (value as JwtPayload).id !== undefined;
};

export const getUserFromToken = async function(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.token) throw boom.unauthorized('token missing or invalid');
  console.log('getUserFromToken');
  try {
    console.log('process.env.SECRET');
    console.log(process.env.SECRET);
    console.log(process.env);
    const decodedToken = jwt.verify(
      res.locals.token,
      process.env.SECRET as Secret
    );

    console.log('isJWTPayload(decodedToken)');
    console.log(isJWTPayload(decodedToken));
    if (isJWTPayload(decodedToken)) {
      if (!decodedToken.id) throw boom.unauthorized('token invalid or missing');

      const userById = await users.getById(decodedToken.id);
      console.log('userById');
      console.log(userById);
      res.locals.user = userById;
      console.log(res.locals);
    }
  } catch (error) {
    console.error(error);
  }
  next();
};
