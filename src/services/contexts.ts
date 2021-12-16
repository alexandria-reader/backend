import boom from '@hapi/boom';
import contextsData from '../data-access/contexts';
import {
  Context, ContextDB, convertContextTypes,
} from '../types';

const addContext = async function(
  snippet: string,
  translationId: number,
): Promise<Array<Context> | null> {
  const results = await contextsData.addContext(snippet, translationId);
  if (!results.rows) throw boom.notFound('Context not added successfully.');
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getAllContextByWordByLang = async function
(word: string, sourceLanguage: string, targetLanguage: string): Promise<Array<Context>> {
  const results = await contextsData.getAllContextByWordByLang
  (word, sourceLanguage, targetLanguage);
  if (!results.rows) throw boom.notFound('No context found for word and language provided.');
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

const getContextByLangByUser = async function
(userId: number, wordId: number, targetLanguageId: string): Promise<Array<Context>> {
  const results = await contextsData.getContextByLangByUser(userId, wordId, targetLanguageId);
  if (!results.rows) throw boom.notFound('No context found for user with user, context id, and target language provided.');
  return results.rows.map((dbItem: ContextDB) => convertContextTypes(dbItem));
};

export default {
  addContext,
  getAllContextByWordByLang,
  getContextByLangByUser,
};
