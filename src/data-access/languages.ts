/* eslint-disable max-len */
import { QueryResult } from 'pg';
import dbQuery from '../model/db-query';
import { Language } from '../types';


const getAll = async function(): Promise<QueryResult> {
  const ALL_LANGUAGES: string = `
    SELECT * FROM languages`;

  const result = await dbQuery(ALL_LANGUAGES);

  return result;
};


const getById = async function(languageId: string): Promise<QueryResult> {
  const LANGUAGE_BY_ID: string = `
    SELECT * FROM languages WHERE id = %L`;

  const result = await dbQuery(LANGUAGE_BY_ID, languageId);

  return result;
};


const addNew = async function(languageObject: Language): Promise<QueryResult> {
  const {
    id,
    name,
    flag,
    eachCharIsWord,
    isRightToLeft,
  } = languageObject;

  const ADD_LANGUAGE: string = `
    INSERT INTO languages (id, name, flag, each_char_is_word, is_right_to_left)
         VALUES (%L, %L, %L, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_LANGUAGE,
    id,
    name,
    flag,
    eachCharIsWord,
    isRightToLeft,
  );

  return result;
};


export default {
  getAll,
  getById,
  addNew,
};
