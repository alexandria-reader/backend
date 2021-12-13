/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import {
  Language, LanguageDB, convertLanguageTypes,
  KnownLanguageDB, KnownLanguage, convertKnownLanguageTypes,
} from '../types';


const addNew = async function(languageData: Language): Promise<Language> {
  const {
    id,
    name,
    googleTranslateURL,
    eachCharIsWord,
    isRightToLeft,
  } = languageData;

  const ADD_LANGUAGE: string = `
    INSERT INTO languages (id, name, google_translate_url, 
                           each_word_is_char, is_right_to_left)
         VALUES (%L, %L, %L, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_LANGUAGE,
    id,
    name,
    googleTranslateURL || null,
    eachCharIsWord,
    isRightToLeft,
  );

  return convertLanguageTypes(result.rows[0]);
};


const getAll = async function(): Promise<Array<Language> | null> {
  const ALL_LANGUAGES: string = `
    SELECT * FROM languages`;

  const result = await dbQuery(ALL_LANGUAGES);

  return result.rows.map((dbItem: LanguageDB) => convertLanguageTypes(dbItem));
};


const getById = async function(languageId: string): Promise<Language> {
  const LANGUAGE_BY_ID: string = `
    SELECT * FROM languages WHERE id = %L`;

  const result = await dbQuery(LANGUAGE_BY_ID, languageId);

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


const addPair = async function(sourceLanguageId: string, targetLanguageId: string) {
  const ADD_LANGUAGE_PAIR: string = `
    INSERT INTO languagepairs (source_language_id, target_language_id)
         VALUES (%L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_LANGUAGE_PAIR,
    sourceLanguageId,
    targetLanguageId,
  );

  return result.rows[0];
};


export default {
  addNew,
  getAll,
  getById,
  getKnownByUser,
  getStudiedByUser,
  addPair,
};
