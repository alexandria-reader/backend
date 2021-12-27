import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import dbQuery from '../model/db-query';
import userData from '../data-access/users';
import { SanitizedUser, User } from '../types';

const sanitizeUser = function (user: User): SanitizedUser {
  const santizedUser: SanitizedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return santizedUser;
};

const selectAllUsers = async function() {
  const result = await userData.selectAllUsers();
  const users = result.rows;
  return users;
};

// eslint-disable-next-line max-len
const addNewUser = async function (username: string, password: string, email: string): Promise<SanitizedUser> {
  const userExists = await userData.getUserByUsername(username);
  if (userExists.rowCount > 0) throw boom.notAcceptable('Username already in use.');

  const emailExists = await userData.getUserByEmail(email);
  if (emailExists.rowCount > 0) throw boom.notAcceptable('Email already in use.');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await userData.addNewUser(username, passwordHash, email);
  const newUser: User = result.rows[0];
  const santizedNewUser: SanitizedUser = sanitizeUser(newUser);
  return santizedNewUser;
};

const verifyPassword = async function(userId: string, password: string): Promise<boolean> {
  const result = await userData.getUserById(userId);
  const user = result.rows[0];
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);
  return passwordsMatch;
};

const updateUserPassword = async function (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string; }> {
  const passwordsMatch = await verifyPassword(userId, currentPassword);

  if (passwordsMatch) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const updatePassword = 'UPDATE users SET password_hash = %L WHERE id = %L';
    const result = await dbQuery(updatePassword, passwordHash, userId);
    if (result.rowCount === 1) {
      return { message: 'Your password has been updated' };
    }

    // throw boom.notAcceptable('Something went wrong.');
  }

  throw boom.notAcceptable('Incorrect password.');
};

const getUserById = async function(userId: string) {
  const user = await userData.getUserById(userId);
  return user;
};

const removeUser = async function (userId: string, password: string) {
  const passwordsMatch = await verifyPassword(userId, password);

  if (passwordsMatch) {
    const result = await userData.removeUser(userId);

    if (result.rowCount > 0) {
      const deletedUser: User = result.rows[0];
      const santizedDeleteUser: SanitizedUser = sanitizeUser(deletedUser);
      return santizedDeleteUser;
    }

    // throw boom.notAcceptable('Something went wrong.');
  }

  return { message: 'Passwords do not match' };
};

// eslint-disable-next-line max-len
const setUserLanguages = async function(currentKnownId: string, currentLearnId: string, userId: string) {
  const result = await userData.setUserLanguages(currentKnownId, currentLearnId, userId);
  return result;
};

export default {
  selectAllUsers,
  addNewUser,
  updateUserPassword,
  removeUser,
  getUserById,
  verifyPassword,
  setUserLanguages,
};
