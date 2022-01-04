/* eslint-disable max-len */
import { QueryResult } from 'pg';
import dbQuery from '../model/db-query';


const getAll = async function(): Promise<QueryResult> {
  const SELECT_ALL_USERS = 'SELECT * FROM users';
  const result = await dbQuery(SELECT_ALL_USERS);
  return result;
};


const getByEmail = async function (email: string): Promise<QueryResult> {
  const CHECK_EMAIL = 'SELECT * FROM users WHERE email = %L';
  const result = await dbQuery(CHECK_EMAIL, email);
  return result;
};


const addNew = async function (username: string, passwordHash: string, email: string, knownLanguageId: string, learnLanguageId: string): Promise<QueryResult> {
  const ADD_USER = 'INSERT INTO users (username, password_hash, email, known_language_id, learn_language_id) Values (%L, %L, %L, %L, %L) RETURNING *';
  const result = await dbQuery(ADD_USER, username, passwordHash, email, knownLanguageId, learnLanguageId);
  return result;
};


const getById = async function (userId: string): Promise<QueryResult> {
  const findUserById = 'SELECT * FROM users WHERE id = %L';
  const result = await dbQuery(findUserById, userId);
  return result;
};


const remove = async function (userId: string): Promise<QueryResult> {
  const deleteUser = 'DELETE FROM users WHERE id = %L RETURNING *';
  const result = await dbQuery(deleteUser, userId);
  return result;
};


const setUserLanguages = async function(knownLanguageId: string, learnLanguageId: string, userId: string) {
  const setKnownLanguage = 'UPDATE users SET known_language_id = %L, learn_language_id = %L WHERE id = %L RETURNING *';
  const result = await dbQuery(setKnownLanguage, knownLanguageId, learnLanguageId, userId);
  return result;
};


const updatePassword = async function(userId: string, newPasswordHash: string) {
  const UPDATE_PASSWORD = 'UPDATE users SET password_hash = %L WHERE id = %L';
  const result = await dbQuery(UPDATE_PASSWORD, newPasswordHash, userId);
  return result;
};

export default {
  // getUserByUsername,
  getByEmail,
  addNew,
  getAll,
  getById,
  remove,
  setUserLanguages,
  updatePassword,
};
