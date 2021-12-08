import dbQuery from '../model/db-query';
import { Language, LanguageDB, convertLanguageTypes } from '../types';

const getAll = async function(): Promise<Array<Language> | null> {
  const ALL_LANGUAGES: string = `
    SELECT * FROM languages`;

  const result = await dbQuery(ALL_LANGUAGES);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: LanguageDB) => convertLanguageTypes(dbItem));
};


const getById = async function(languageId: string): Promise<Language | null> {
  const LANGUAGE_BY_ID: string = `
    SELECT * FROM languages WHERE id = %L`;

  const result = await dbQuery(LANGUAGE_BY_ID, languageId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


const addNew = async function(languageData: Language) {
  const {
    id,
    name,
    googleTranslateURL,
    eachCharIsWord,
    isRightToLeft,
  } = languageData;

  const ADD_LANGUAGE: string = `
    INSERT INTO languages 
    (id, name, google_translate_url, each_word_is_char, is_right_to_left)
    VALUES 
    (%L, %L, %L, %L, %L)`;

  await dbQuery(
    ADD_LANGUAGE,
    id,
    name,
    googleTranslateURL || null,
    eachCharIsWord,
    isRightToLeft,
  );
};


export default {
  getAll,
  getById,
  addNew,
};
