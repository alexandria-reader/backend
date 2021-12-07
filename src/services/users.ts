import dbQuery from '../model/db-query';

export const selectAllUsers = async function() {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result.rows;
};

export const addNewUser = async function (username: string, password_hash: string, email: string) {
  const ADD_USER = 'INSERT INTO users (username, password_hash, email) $1, $2, $3';
  const result = await dbQuery(ADD_USER, username, password_hash, email);
  return result.rowCount > 0;
};
