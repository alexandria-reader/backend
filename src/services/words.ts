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


const getOne = async function(wordId: number): Promise<Word | null> {
  const WORD_BY_ID: string = `
    SELECT * FROM words WHERE id = %L`;

  const result = await dbQuery(WORD_BY_ID, wordId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const getSome = async function(languageId: string, userId: number): Promise<Array<Word> | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = `
    SELECT * FROM words AS w 
    JOIN users_words AS uw ON w.id = uw.word_id 
    WHERE w.language_id = %L AND uw.user_id = %L`;

  const result = await dbQuery(WORDS_BY_LANGUAGE_AND_USER, languageId, userId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};

// eslint-disable-next-line max-len
const putOne = async function( wordId: number, userId: number, status: string): Promise<Array<Word> | null> {
  const WORDS_BY_LANGUAGE_AND_USER: string = 'UPDATE users_words SET word_status = %L WHERE user_id = %L AND word_id = %L; ';

  const result = await dbQuery(WORDS_BY_LANGUAGE_AND_USER, status, userId, wordId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


export default {
  getAll,
  getOne,
  getSome,
  putOne,
};
