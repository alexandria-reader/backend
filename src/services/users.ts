/* eslint-disable max-len */
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';
import userData from '../data-access/users';
import languages from './languages';
import {
  SanitizedUser,
  User,
  convertUserTypes,
  Language,
} from '../types';


const sanitizeUser = function (user: User): SanitizedUser {
  const santizedUser: SanitizedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    knows: user.knows,
    learns: user.learns,
  };

  return santizedUser;
};

const addLanguages = async function(user: User): Promise<void> {
  const updatedUser = user;
  const knownLanguage: Language = await languages.getById(String(user.knows));
  const learnLanguage: Language = await languages.getById(String(user.learns));

  updatedUser.knows = knownLanguage;
  updatedUser.learns = learnLanguage;
};


const getAll = async function() {
  const result = await userData.getAll();
  const users = result.rows;
  return users;
};


const addNew = async function (username: string, password: string, email: string, knownLanguageId: string, learnLanguageId: string): Promise<SanitizedUser> {
  const emailExists = await userData.getByEmail(email);
  if (emailExists.rowCount > 0) throw boom.notAcceptable('Email already in use.');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await userData.addNew(username, passwordHash, email, knownLanguageId, learnLanguageId);
  const newUser: User = convertUserTypes(result.rows[0]);

  await addLanguages(newUser);

  return sanitizeUser(newUser);
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


const getById = async function(userId: string): Promise<SanitizedUser> {
  const result: QueryResult = await userData.getById(userId);

  if (result.rowCount === 0) throw boom.notFound('cannot find user with this id');

  const foundUser: User = convertUserTypes(result.rows[0]);

  await addLanguages(foundUser);

  return sanitizeUser(foundUser);
};


const remove = async function (userId: string, password: string) {
  const passwordsMatch = await verifyPassword(userId, password);

  if (passwordsMatch) {
    const result = await userData.remove(userId);

    if (result.rowCount > 0) {
      const deletedUser: User = result.rows[0];
      const santizedDeleteUser: SanitizedUser = sanitizeUser(deletedUser);
      return santizedDeleteUser;
    }
  }

  throw boom.unauthorized('Incorrect password.');
};


// eslint-disable-next-line max-len
const setUserLanguages = async function(currentKnownId: string, currentLearnId: string, userId: string) {
  const result = await userData.setUserLanguages(currentKnownId, currentLearnId, userId);

  if (result.rowCount === 0) throw boom.notAcceptable('Something went wrong');

  const updatedUser: User = convertUserTypes(result.rows[0]);

  await addLanguages(updatedUser);

  return sanitizeUser(updatedUser);
};


export default {
  sanitizeUser,
  addLanguages,
  getAll,
  addNew,
  updatePassword,
  remove,
  getById,
  verifyPassword,
  setUserLanguages,
};
