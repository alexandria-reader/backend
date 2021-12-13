import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import dbQuery from '../model/db-query';
import { convertUserTypes, User } from '../types';

const selectAllUsers = async function() {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result.rows;
};

const addNewUser = async function (userData: User): Promise<User> {
  const { username, passwordHash, email } = userData;

  const CHECK_USERNAME = 'SELECT * FROM users WHERE username = %L';
  let checkResult = await dbQuery(CHECK_USERNAME, username);
  if (checkResult.rowCount > 0) throw boom.notAcceptable('Username already taken.');

  const CHECK_EMAIL = 'SELECT * FROM users WHERE email = %L';
  checkResult = await dbQuery(CHECK_EMAIL, email);
  if (checkResult.rowCount > 0) throw boom.notAcceptable('Email already in user by different user.');

  const ADD_USER = 'INSERT INTO users (username, password_hash, email) Values (%L, %L, %L) RETURNING *';
  const result = await dbQuery(ADD_USER, username, passwordHash, email);

  return convertUserTypes(result.rows[0]);
};

const verifyPassword = async function(userId: string, password: string): Promise<boolean> {
  const findUserById = 'SELECT * FROM users WHERE id = %L';
  const user = await dbQuery(findUserById, userId);
  const passwordsMatch = await bcrypt.compare(password, user.rows[0].password_hash);
  return passwordsMatch;
};

const updateUserPassword = async function (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const passwordsMatch = await verifyPassword(userId, currentPassword);

  if (passwordsMatch) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const updatePassword = 'UPDATE users SET password_hash = %L WHERE id = %L';
    const result = await dbQuery(updatePassword, passwordHash, userId);
    return result.rowCount === 1;
  }

  return false;
};

const removeUser = async function (userId: string, password: string) {
  const passwordsMatch = await verifyPassword(userId, password);

  if (passwordsMatch) {
    // add email check once login is implemented
    try {
      const deleteUser = 'DELETE FROM users WHERE id = %L';
      const result = await dbQuery(deleteUser, userId);

      if (result.rowCount > 0) {
        return { message: 'Your account has been deleted' };
      }
    } catch (error) {
      return { message: 'Something went wrong.' };
    }
  }

  return { message: 'Passwords do not match' };
};

export default {
  selectAllUsers,
  addNewUser,
  updateUserPassword,
  removeUser,
};

// add update password / email routes
// set user source/known language
// set language to be learned
