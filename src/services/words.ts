/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import { Word, WordDB, convertWordTypes } from '../types';


const getAll = async function(): Promise<Array<Word> | null> {
  const ALL_WORDS: string = `
    SELECT * FROM words`;

  const result = await dbQuery(ALL_WORDS);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


const getById = async function(wordId: number): Promise<Word | null> {
  const WORD_BY_ID: string = `
    SELECT * FROM words WHERE id = %L`;

  const result = await dbQuery(WORD_BY_ID, wordId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


const getByLanguageAndUser = async function(langId: string, userId: number): Promise<Array<Word> | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = `
    SELECT * FROM words AS w 
    JOIN users_words AS uw ON w.id = uw.word_id 
    WHERE w.language_id = %L AND uw.user_id = %L`;

  const result = await dbQuery(WORDS_BY_LANGUAGE_AND_USER, langId, userId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


const updateStatus = async function(wordId: number, userId: number, status: string): Promise<Word | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = `
    UPDATE users_words 
    SET word_status = %L 
    WHERE user_id = %L AND word_id = %L`;

  await dbQuery(
    WORDS_BY_LANGUAGE_AND_USER,
    status,
    userId,
    wordId,
  );

  return getById(wordId);
};


const getByLanguageAndWord = async function(languageId: string, word: string): Promise<Array<Word> | null> {
  const WORD_BY_LANGUAGE_AND_WORD: string = `
    SELECT * FROM words 
    WHERE language_id = %L and word = %L`;

  const result = await dbQuery(WORD_BY_LANGUAGE_AND_WORD, languageId, word);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


const addNew = async function(wordData: Word): Promise<boolean> {
  const {
    languageId,
    word,
  } = wordData;

  const ADD_WORD: string = `
    INSERT INTO words 
    (language_id, word)
    VALUES 
    (%L, %L)`;

  if (await getByLanguageAndWord(languageId, word)) {
    console.log('word already exists');
    return false;
  }

  await dbQuery(
    ADD_WORD,
    languageId,
    word,
  );
  return true;
};


export default {
  getAll,
  getById,
  getByLanguageAndUser,
  getByLanguageAndWord,
  addNew,
  updateStatus,
};
