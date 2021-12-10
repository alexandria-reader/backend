import bcrypt from 'bcrypt';
import dbQuery from '../model/db-query';
import { User } from '../types';

export const selectAllUsers = async function() {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result.rows;
};

export const addNewUser = async function (user: User) {
  const { username, passwordHash, email } = user;

  const ADD_USER = 'INSERT INTO users (username, password_hash, email) Values (%L, %L, %L)';

  try {
    const result = await dbQuery(ADD_USER, username, passwordHash, email);
    if (result.rowCount > 0) {
      return { message: `User ${username} succesfully created` };
    }
    return result.rowCount > 0;
  } catch (error: any) {
    console.log(error);
    if (error.code === '23505') {
      if (/email/.test(error.detail)) {
        return { message: 'Email already exists' };
      } if (/username/.test(error.detail)) {
        return { message: 'Name already exists' };
      }
    }
    return { message: 'Something went wrong.' };
  }
};

// reset password
// find user
// check if password hash matches db
// if so, replace password hash with new password hash

export const updateUserPassword = async function (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const findUserById = 'SELECT * FROM users WHERE id = %L';
  const user = await dbQuery(findUserById, userId);
  const passwordsMatch = await bcrypt.compare(currentPassword, user.rows[0].password_hash);

  if (passwordsMatch) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const updatePassword = 'UPDATE users SET password_hash = %L WHERE id = %L';
    const result = await dbQuery(updatePassword, passwordHash, userId);
    return result.rowCount === 1;
  }

  return false;
};

// add user tests
// add update password / email routes
// set user source/known language
// set language to be learned
