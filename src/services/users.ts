/* eslint-disable max-len */
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt, { Secret } from 'jsonwebtoken';
import { QueryResult } from 'pg';
import userData from '../data-access/users';
import {
  SanitizedUser,
  User,
  convertUserTypes,
} from '../types';

const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async function (code: string, email: string, name: string) {
  const token = jwt.sign(
    email,
    String(process.env.SECRET),
  );

  const mail = {
    to: email,
    from: 'read.with.alexandria@gmail.com',
    subject: 'Verify your email address for Alexandria',
    text: `Text version of the link: https://alexandria-reader-staging.herokuapp.com/verify/${code}/${token}`,
    html: `
    <h3>Hello, ${name}!</h3>
    <p>Please follow this link to verify the email address you used to sign up for Alexandria:</p>
    <p><a href="https://alexandria-reader-staging.herokuapp.com/verify/${code}/${token}">Verify ${email}</a></p>
    <p>You can then start to add your own texts.</p>
    <p>Greetings from team Alexandria</p>`,
  };

  const response = await sgMail.send(mail);
  console.log(response[0].statusCode);
  console.log(response[0].headers);
};


const sanitizeUser = function (user: User): SanitizedUser {
  const santizedUser: SanitizedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    knownLanguageId: user.knownLanguageId,
    learnLanguageId: user.learnLanguageId,
    verified: user.verified,
  };

  return santizedUser;
};


const getAll = async function() {
  const result = await userData.getAll();
  const users = result.rows;
  return users;
};


const getById = async function(userId: string, sanitize: boolean = true): Promise<SanitizedUser | User> {
  const result: QueryResult = await userData.getById(userId);

  if (result.rowCount === 0) throw boom.notFound('cannot find user with this id');

  const foundUser: User = convertUserTypes(result.rows[0]);

  if (sanitize) return sanitizeUser(foundUser);

  return foundUser;
};


const addNew = async function(
  username: string,
  password: string,
  email: string,
  knownLanguageId: string,
  learnLanguageId: string,
): Promise<SanitizedUser> {
  const emailExists = await userData.getByEmail(email);
  if (emailExists.rowCount > 0) throw boom.notAcceptable('Email already in use.');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const verificationCode = uuidv4();

  const result = await userData.addNew(username, passwordHash, email, knownLanguageId, learnLanguageId, verificationCode);
  const newUser: User = convertUserTypes(result.rows[0]);

  sendVerificationEmail(verificationCode, email, username);

  return sanitizeUser(newUser);
};


const verify = async function (code: string, token: string): Promise<SanitizedUser> {
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret);

  if (typeof decodedToken === 'string') {
    let result: QueryResult = await userData.getByEmail(decodedToken);
    if (result.rowCount === 0) throw boom.notFound('cannot find user with this email');

    const foundUser: User = convertUserTypes(result.rows[0]);
    if (foundUser.verificationCode !== code) throw boom.unauthorized('invalid verification code');

    result = await userData.verify(Number(foundUser.id));
    if (result.rowCount === 0) throw boom.notFound('cannot verify user');

    const verifiedUser = convertUserTypes(result.rows[0]);
    return sanitizeUser(verifiedUser);
  }

  throw boom.unauthorized('invalid token');
};


const verifyPassword = async function(userId: string, password: string): Promise<boolean> {
  const result = await userData.getById(userId);
  const user = result.rows[0];
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);
  return passwordsMatch;
};


const updatePassword = async function (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string; }> {
  if (!currentPassword) {
    throw boom.notAcceptable('You must submit your current password.');
  } else if (!newPassword) {
    throw boom.notAcceptable('You must submit a new password.');
  }

  const passwordsMatch = await verifyPassword(userId, currentPassword);

  if (passwordsMatch) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const result = await userData.updatePassword(userId, passwordHash);

    if (result.rowCount === 1) {
      return { message: 'Your password has been updated' };
    }
  }

  throw boom.notAcceptable('Incorrect password.');
};


const remove = async function (userId: string, password: string): Promise<SanitizedUser> {
  const passwordsMatch = await verifyPassword(userId, password);

  if (passwordsMatch) {
    const result = await userData.remove(userId);

    if (result.rowCount > 0) {
      const deletedUser: User = result.rows[0];
      return sanitizeUser(deletedUser);
    }
  }

  throw boom.unauthorized('Incorrect password.');
};


const setUserLanguages = async function(
  knownLanguageId: string,
  learnLanguageId: string,
  userId: string,
): Promise<SanitizedUser> {
  const result = await userData.setUserLanguages(knownLanguageId, learnLanguageId, userId);

  if (result.rowCount === 0) throw boom.notAcceptable('Something went wrong');

  const updatedUser: User = convertUserTypes(result.rows[0]);

  return sanitizeUser(updatedUser);
};

const updateUserInfo = async function(
  userId: string,
  userName: string,
  email: string,
): Promise<SanitizedUser> {
  const result = await userData.updateUserInfo(userId, userName, email);

  if (result.rowCount === 0) throw boom.notAcceptable('Something went wrong');

  const updatedUser: User = convertUserTypes(result.rows[0]);

  return sanitizeUser(updatedUser);
};


export default {
  sanitizeUser,
  getAll,
  addNew,
  updatePassword,
  remove,
  getById,
  verifyPassword,
  verify,
  setUserLanguages,
  updateUserInfo,
  sendVerificationEmail,
};
