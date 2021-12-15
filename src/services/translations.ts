import translations from '../data-access/translations';
import {
  Translation, TranslationDB, convertTranslationTypes,
} from '../types';

const getAllByUser = async function(userId: number): Promise<Array<Translation> | null> {
  const results = await translations.getAllByUser(userId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAll = async function() {
  const results = await translations.getAll();
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getOne = async function(translationId: number) {
  const result = await translations.getOne(translationId);
  return convertTranslationTypes(result.rows[0]);
};

const getByWord = async function
(word: string, userId: number): Promise<Array<Translation> | null> {
  const results = await translations.getByWord(word, userId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const getAllByWordByLang = async function
(word: string, langId: string): Promise<Array<Translation>> {
  const results = await translations.getAllByWordByLang(word, langId);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const add = async function(
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const results = await translations.add(wordId, translation, targetLang);
  return results.rows.map((dbItem: TranslationDB) => convertTranslationTypes(dbItem));
};

const addToUsersTranslations = async function(
  userId: number,
  translationId: number,
) {
  const result = await translations.addToUsersTranslations(userId, translationId);
  return result;
};

const update = async function(
  translation: string,
  translationId: number,
) {
  const result = await translations.update(translation, translationId);
  return result;
};

const remove = async function(
  translationId: number,
) {
  const result = await translations.remove(translationId);
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
