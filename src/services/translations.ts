import dbQuery from '../model/db-query';
import {
  Translation, TranslationDB, convertTranslationTypes,
} from '../types';

const getAllByUser = async function(userId: number): Promise<Array<Translation> | null> {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations AS t JOIN users_translations AS ut ON t.id = ut.translation_id AND user_id = %L';
  const results = await dbQuery(FIND_TRANSLATIONS, userId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAll = async function() {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations';
  const results = await dbQuery(FIND_TRANSLATIONS);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getOne = async function(translationId: number) {
  const FIND_TRANSLATION = 'SELECT * FROM translations WHERE id = %L';
  const result = await dbQuery(FIND_TRANSLATION, translationId);
  return convertTranslationTypes(result.rows[0]);
};

const getByWord = async function(wordId: number, userId: number): Promise<Array<Translation> | null> {
  const FIND_WORD_TRAN = 'SELECT * FROM translations AS t JOIN users_translations AS ut ON t.id = ut.translation_id WHERE ut.user_id = %L AND t.word_id = %L;';
  const results = await dbQuery(FIND_WORD_TRAN, userId, wordId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAllByWordByLang = async function(wordId: number, langId: string): Promise<Array<Translation>> {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
  const results = await dbQuery(FIND_TRANSLATIONS, wordId, langId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const add = async function(
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L) RETURNING *';
  const results = await dbQuery(INSERT_TRANSLATION, wordId, translation, targetLang);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const addToUsersTranslations = async function(
  userId: number,
  translationId: number,
) {
  const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id) VALUES(%L, %L) RETURNING users_translations.*';
  const result = await dbQuery(USER_TRANSLATION, userId, translationId);
  return result;
};

const update = async function(
  translation: string,
  translationId: number,
) {
  const UPDATE_TRANSLATION = 'UPDATE translations SET translation = %L WHERE id = %L RETURNING translations.*';
  const result = await dbQuery(UPDATE_TRANSLATION, translation, translationId);
  return result;
};

const remove = async function(
  translationId: number,
) {
  const REMOVE_USERS_TRANSLATIONS = 'DELETE FROM users_translations WHERE translation_id = %L RETURNING *';
  const result = await dbQuery(REMOVE_USERS_TRANSLATIONS, translationId);
  return result;
};

export default {
  getAllByUser,
  getAll,
  getOne,
  getByWord,
  getAllByWordByLang,
  add,
  addToUsersTranslations,
  update,
  remove,
};
