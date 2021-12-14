import dbQuery from '../model/db-query';
import { Translation, TranslationDB, convertTranslationTypes } from '../types';

const getAllByUser = async function(userId: number): Promise<Array<Translation> | null> {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations AS t JOIN users_translations AS ut ON t.id = ut.translation_id AND user_id = %L';
  const results = await dbQuery(FIND_TRANSLATIONS, userId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAll = async function() {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations';
  const results = await dbQuery(FIND_TRANSLATIONS);
  return results.rows;
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

const getAllContextByLang = async function(wordId: number, langId: string): Promise<Array<Translation>> {
  const FIND_CONTEXT = 'SELECT * FROM contexts AS c JOIN translations as t ON t.id = c.translation_id WHERE t.word_id = %L AND t.target_language_id = %L';
  const results = await dbQuery(FIND_CONTEXT, wordId, langId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getContextByLangByUser = async function(userId: number, wordId: number, langId: string): Promise<Array<Translation>> {
  const FIND_CONTEXT_BY_USER = 'SELECT * FROM contexts JOIN (SELECT * FROM translations JOIN users_translations ON translations.id = users_translations.translation_id WHERE users_translations.user_id = %L AND translations.word_id = %L AND translations.target_language_id = %L) as translations ON contexts.translation_id = translations.translation_id';
  const results = await dbQuery(FIND_CONTEXT_BY_USER, userId, wordId, langId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

// Need to convert return (id, user_id, translation_id) to a translation type
const add = async function(
  userId: number,
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L) RETURNING *';
  const result = await dbQuery(INSERT_TRANSLATION, wordId, translation, targetLang);
  console.log(result);
  const LAST_INSERTION = 'SELECT * FROM translations WHERE id=(SELECT max(id) FROM translations)';
  const resultLastInsertion = await dbQuery(LAST_INSERTION);
  const lastInsertionId = resultLastInsertion.rows[0].id;
  const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id) VALUES(%L, %L) RETURNING users_translations.*';
  await dbQuery(USER_TRANSLATION, userId, lastInsertionId);
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
  console.log(result);
  return result;
};

export default {
  getAllByUser,
  getAll,
  getOne,
  getByWord,
  getAllByWordByLang,
  getContextByLangByUser,
  getAllContextByLang,
  add,
  update,
  remove,
};
