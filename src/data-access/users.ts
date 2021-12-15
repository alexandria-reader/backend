import { QueryResult } from 'pg';
import dbQuery from '../model/db-query';

const selectAllUsers = async function(): Promise<QueryResult> {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result;
};

const getUserByUsername = async function (username: string) {
  const CHECK_USERNAME = 'SELECT * FROM users WHERE username = %L';
  const checkResult = await dbQuery(CHECK_USERNAME, username);
  return checkResult;
};

const getUserByEmail = async function (email: string): Promise<QueryResult> {
  const CHECK_EMAIL = 'SELECT * FROM users WHERE email = %L';
  const checkResult = await dbQuery(CHECK_EMAIL, email);
  return checkResult;
};

// eslint-disable-next-line max-len
const addNewUser = async function (username: string, passwordHash: string, email: string): Promise<QueryResult> {
  const ADD_USER = 'INSERT INTO users (username, password_hash, email) Values (%L, %L, %L) RETURNING *';
  const result = await dbQuery(ADD_USER, username, passwordHash, email);
  return result;
};

const getUserById = async function (userId: string): Promise<QueryResult> {
  const findUserById = 'SELECT * FROM users WHERE id = %L';
  const result = await dbQuery(findUserById, userId);
  return result;
};

const removeUser = async function (userId: string): Promise<QueryResult> {
  const deleteUser = 'DELETE FROM users WHERE id = %L RETURNING *';
  const result = await dbQuery(deleteUser, userId);
  return result;
};

export default {
  getUserByUsername,
  getUserByEmail,
  addNewUser,
  selectAllUsers,
  getUserById,
  removeUser,
};
