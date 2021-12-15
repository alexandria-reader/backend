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
    eachCharIsWord,
    isRightToLeft,
  } = languageObject;

  const ADD_LANGUAGE: string = `
    INSERT INTO languages (id, name, each_char_is_word, is_right_to_left)
         VALUES (%L, %L, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_LANGUAGE,
    id,
    name,
    eachCharIsWord,
    isRightToLeft,
  );

  return result;
};


const getKnownByUser = async function(userId: number): Promise<QueryResult> {
  const KNOWN_BY_USER: string = `
    SELECT id, 
           name, 
           google_translate_url, 
           each_char_is_word, 
           is_right_to_left, 
           is_native 
      FROM languages AS l
      JOIN users_know_languages ON l.id = known_language_id
     WHERE user_id = %L`;

  const result = await dbQuery(KNOWN_BY_USER, userId);

  return result;
};


const addKnownByUser = async function(languageId: string, userId: number, isNative: boolean): Promise<QueryResult> {
  const ADD_KNOWN_BY_USER = `
    INSERT INTO users_know_languages (language_id, user_id, is_native)
         VALUES (%L, %s, %L)
     RETURNNING *`;

  const userLanguageResult = await dbQuery(
    ADD_KNOWN_BY_USER,
    languageId,
    userId,
    isNative,
  );

  // if (userLanguageResult.rowCount === 0) return null;

  // const language = await getById(languageId);
  // if (!language) return null;

  // return { ...language, isNative };
  return userLanguageResult;
};


const getStudiedByUser = async function(userId: number): Promise<QueryResult> {
  const STUDIED_BY_USER: string = `
    SELECT l.id, 
           name, 
           google_translate_url, 
           each_char_is_word, 
           is_right_to_left 
      FROM languages AS l
      JOIN users_study_languages ON l.id = study_language_id
     WHERE user_id = %L`;

  const result = await dbQuery(STUDIED_BY_USER, userId);

  return result;
};


const addStudiedByUser = async function(languageId: string, userId: number): Promise<QueryResult> {
  const ADD_STUDIED_BY_USER = `
    INSERT INTO users_study_languages (language_id, user_id)
         VALUES (%L, %s, %L)
     RETURNNING *`;

  const studyLanguageResult = await dbQuery(
    ADD_STUDIED_BY_USER,
    languageId,
    userId,
  );

  // if (!studyLanguageResult) return null;

  // const studyLanguage = await getById(languageId);

  return studyLanguageResult;
};


export default {
  getAll,
  getById,
  addNew,
  getKnownByUser,
  addKnownByUser,
  getStudiedByUser,
  addStudiedByUser,
};
