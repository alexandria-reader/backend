import contexts from '../data-access/contexts';
import {
  Context, ContextDB, convertContextTypes,
} from '../types';

const addContext = async function(
  snippet: string,
  translationId: number,
): Promise<Array<Context> | null> {
  const results = await contexts.addContext(snippet, translationId);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getAllContextByLang = async function(translationId: number): Promise<Array<Context>> {
  const results = await contexts.getAllContextByLang(translationId);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getContextByLangByUser = async function
(userId: number, wordId: number, targetLanguageId: string): Promise<Array<Context>> {
  const results = await contexts.getContextByLangByUser(userId, wordId, targetLanguageId);
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

export default {
  addContext,
  getAllContextByLang,
  getContextByLangByUser,
};
