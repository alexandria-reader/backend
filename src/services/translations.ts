import boom from '@hapi/boom';
import translationsData from '../data-access/translations';
import {
  Translation, TranslationDB, convertTranslationTypes,
} from '../types';

const getAllByUser = async function(userId: number): Promise<Array<Translation> | null> {
  const results = await translationsData.getAllByUser(userId);
  if (!results.rows) throw boom.notFound('No translations found for this user.');
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAll = async function() {
  const results = await translationsData.getAll();
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getOne = async function(translationId: number) {
  const result = await translationsData.getOne(translationId);
  if (!result.rows) throw boom.notFound('No translations with this id is found.');
  return convertTranslationTypes(result.rows[0]);
};

const getByWord = async function
(word: string, userId: number): Promise<Array<Translation> | null> {
  const results = await translationsData.getByWord(word, userId);
  if (!results.rows) throw boom.notFound('No translations found for this word.');
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAllByWordByLang = async function
(word: string, langId: string): Promise<Array<Translation>> {
  const results = await translationsData.getAllByWordByLang(word, langId);
  if (!results.rows) throw boom.notFound('No translations found for word in language provided.');
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const add = async function(
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const result = await translationsData.add(wordId, translation, targetLang);
  if (!result.rows) throw boom.notFound('Adding new translation not successful.');
  return result.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem))[0];
};

const addToUsersTranslations = async function(
  userId: number,
  translationId: number,
  context: string | undefined,
) {
  const result = await translationsData.addToUsersTranslations(userId, translationId, context);
  if (!result.rows) throw boom.notFound('Adding new translation with given user and translation id input not successful.');
  return result;
};

const update = async function(
  translation: string,
  translationId: number,
) {
  const result = await translationsData.update(translation, translationId);
  if (!result.rows) throw boom.notFound('Updating translation with given translation id not successful.');
  return result;
};

const remove = async function(
  translationId: number,
) {
  const result = await translationsData.remove(translationId);
  if (!result.rows) throw boom.notFound('Removing translation not successful.');
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
