import dbQuery from '../model/db-query';
import { User } from '../types';

export const selectAllUsers = async function() {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result.rows;
};

export const addNewUser = async function (user: User) {
  console.log(user);
  const { username, passwordHash, email } = user;

  const ADD_USER = 'INSERT INTO users (username, password_hash, email) Values (%L, %L, %L)';
  const result = await dbQuery(ADD_USER, username, passwordHash, email);
  return result.rowCount > 0;
};
