import bcrypt from 'bcrypt';
import dbQuery from '../model/db-query';
import { User } from '../types';

const selectAllUsers = async function() {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result.rows;
};

const addNewUser = async function (user: User) {
  const { username, passwordHash, email } = user;

  const ADD_USER = 'INSERT INTO users (username, password_hash, email) Values (%L, %L, %L)';

  try {
    const result = await dbQuery(ADD_USER, username, passwordHash, email);
    if (result.rowCount > 0) {
      return { message: `User ${username} succesfully created` };
    }
    return result.rowCount > 0;
  } catch (error: any) {
    // need to figure out how to get a type for pg errors
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
