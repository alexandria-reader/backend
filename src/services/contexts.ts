import dbQuery from '../model/db-query';
import {
  Context, ContextDB, convertContextTypes,
} from '../types';

const addContext = async function(
  snippet: string,
  translationId: number,
): Promise<Array<Context> | null> {
  const INSERT_CONTEXT = 'INSERT INTO contexts ( translation_id, snippet) VALUES (%L, %L) RETURNING *';
  const results = await dbQuery(INSERT_CONTEXT, translationId, snippet);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getAllContextByLang = async function(translationId: number): Promise<Array<Context>> {
  const FIND_CONTEXT = 'SELECT * FROM contexts WHERE translation_id = %L';
  const results = await dbQuery(FIND_CONTEXT, translationId);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getContextByLangByUser = async function(userId: number, wordId: number, targetLanguageId: string): Promise<Array<Context>> {
  const FIND_CONTEXT = 'SELECT * FROM contexts JOIN (SELECT * FROM translations JOIN users_translations ON translations.id = users_translations.translation_id WHERE users_translations.user_id = %L AND translations.word_id = %L AND translations.target_language_id = %L) as translations ON contexts.translation_id = translations.translation_id';
  const results = await dbQuery(FIND_CONTEXT, userId, wordId, targetLanguageId);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

export default {
  addContext,
  getAllContextByLang,
  getContextByLangByUser,
};
