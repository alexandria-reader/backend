/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import {
  Language, LanguageDB, convertLanguageTypes,
  KnownLanguageDB, KnownLanguage, convertKnownLanguageTypes,
} from '../types';


const getAll = async function(): Promise<Array<Language>> {
  const ALL_LANGUAGES: string = `
    SELECT * FROM languages`;

  const result = await dbQuery(ALL_LANGUAGES);

  return result.rows.map((dbItem: LanguageDB) => convertLanguageTypes(dbItem));
};


const getById = async function(languageId: string): Promise<Language | null> {
  const LANGUAGE_BY_ID: string = `
    SELECT * FROM languages WHERE id = %L`;

  const result = await dbQuery(LANGUAGE_BY_ID, languageId);

  if (result.rowCount === 0) return null;

  return convertLanguageTypes(result.rows[0]);
};


const addNew = async function(languageData: Language): Promise<Language | null> {
  const {
    id,
    name,
    eachCharIsWord,
    isRightToLeft,
  } = languageData;

  const ADD_LANGUAGE: string = `
    INSERT INTO languages (id, name, each_word_is_char, is_right_to_left)
         VALUES (%L, %L, %L, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_LANGUAGE,
    id,
    name,
    eachCharIsWord,
    isRightToLeft,
  );

  if (result.rowCount === 0) return null;

  return convertLanguageTypes(result.rows[0]);
};


const getKnownByUser = async function(userId: number): Promise<Array<KnownLanguage>> {
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

  return result.rows.map((dbItem: KnownLanguageDB): KnownLanguage => convertKnownLanguageTypes(dbItem));
};


const addKnownByUser = async function(languageId: string, userId: number, isNative: boolean): Promise<KnownLanguage | null> {
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

  if (userLanguageResult.rowCount === 0) return null;

  const language = await getById(languageId);
  if (!language) return null;

  return { ...language, isNative };
};


const getStudiedByUser = async function(userId: number): Promise<Array<Language>> {
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

  return result.rows.map((dbItem: LanguageDB): Language => convertLanguageTypes(dbItem));
};


const addStudiedByUser = async function(languageId: string, userId: number): Promise<Language | null> {
  const ADD_STUDIED_BY_USER = `
    INSERT INTO users_study_languages (language_id, user_id)
         VALUES (%L, %s, %L)
     RETURNNING *`;

  const studyLanguageResult = await dbQuery(
    ADD_STUDIED_BY_USER,
    languageId,
    userId,
  );

  if (!studyLanguageResult) return null;

  const studyLanguage = await getById(languageId);

  return studyLanguage;
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
