/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import { Word, WordDB, convertWordTypes } from '../types';


// Returning all words in the database is most likely not needed
const getAll = async function(): Promise<Array<Word> | null> {
  const ALL_WORDS: string = `
    SELECT * FROM words`;

  const result = await dbQuery(ALL_WORDS);
  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


const getById = async function(wordId: number): Promise<Word | null> {
  const WORD_BY_ID: string = `
    SELECT * FROM words 
    WHERE id = %L`;

  const result = await dbQuery(WORD_BY_ID, wordId);
  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem))[0];
};


// Finds all words in a given language that are connected to the user
const getByLanguageAndUser = async function(languageId: string, userId: number): Promise<Array<Word> | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = `
    SELECT * FROM words AS w 
      JOIN users_words AS uw 
        ON w.id = uw.word_id 
     WHERE w.language_id = %L AND 
           uw.user_id = %L`;

  const result = await dbQuery(WORDS_BY_LANGUAGE_AND_USER, languageId, userId);
  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


// Helper function to check whether a word already exist in a given language
const getWordInLanguage = async function(word: string, languageId: string): Promise<Word | null> {
  const WORD_BY_LANGUAGE_AND_WORD: string = `
    SELECT * FROM words 
     WHERE language_id = %L AND 
           word = %L`;

  const result = await dbQuery(WORD_BY_LANGUAGE_AND_WORD, languageId, word);

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem))[0];
};


const addNew = async function(wordData: Word): Promise<Word | null> {
  const {
    languageId,
    word,
  } = wordData;

  const existingWord = await getWordInLanguage(languageId, word);
  if (existingWord) {
    console.log('word already exists, returning original');
    return existingWord;
  }

  const ADD_WORD: string = `
    INSERT INTO words (language_id, word)
         VALUES (%L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_WORD,
    languageId,
    word,
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem))[0];
};


const remove = async function(wordId: number): Promise <Word | null> {
  const DELETE_WORD: string = `
       DELETE FROM words
        WHERE id = %s
    RETURNING *`;

  const result = await dbQuery(
    DELETE_WORD,
    wordId,
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem))[0];
};


// Retrieves word status string for given user
const getStatus = async function(userId: number, wordId: number): Promise<string | null> {
  const GET_USER_WORD_STATUS: string = `
    SELECT word_status FROM users_words 
     WHERE user_id = %s AND
           word_id = %s`;

  const result = await dbQuery(
    GET_USER_WORD_STATUS,
    userId,
    wordId,
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows[0].word_status;
};


const addStatus = async function(wordId: number, userId: number, wordStatus: string): Promise<string | null> {
  const ADD_USER_WORD_STATUS: string = `
    INSERT INTO users_words (user_id, word_id, word_status)
         VALUES (%s, %s, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_USER_WORD_STATUS,
    userId,
    wordId,
    wordStatus,
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows[0].word_status;
};


const updateStatus = async function(wordId: number, userId: number, status: string): Promise<string | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = `
       UPDATE users_words 
          SET word_status = %L 
        WHERE user_id = %L AND
              word_id = %L
    RETURNING *`;

  const result = await dbQuery(
    WORDS_BY_LANGUAGE_AND_USER,
    status,
    userId,
    wordId,
  );

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows[0].word_status;
};


export default {
  getAll,
  getById,
  getByLanguageAndUser,
  addNew,
  remove,
  getStatus,
  addStatus,
  updateStatus,
};
