/* eslint-disable max-len */
import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import wordData from '../data-access/words';
import translationData from '../data-access/translations';
import {
  WordDB, Word, convertWordTypes, UserWord,
} from '../types';


const getAll = async function(): Promise<Array<Word>> {
  const result: QueryResult = await wordData.getAll();

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};


const getById = async function(wordId: number): Promise<Word> {
  const result: QueryResult = await wordData.getById(wordId);

  if (result.rowCount === 0) throw boom.notFound('Could not find word with this id.');

  return convertWordTypes(result.rows[0]);
};


const getByLanguageAndUser = async function(languageId: string, userId: number): Promise<Array<Word>> {
  const result: QueryResult = await wordData.getByLanguageAndUser(languageId, userId);

  return result.rows.map((dbItem: WordDB) => convertWordTypes(dbItem));
};

const getUserwordsInText = async function(userId: number, textId: number, simple: boolean = true): Promise<Array<UserWord>> {
  const wordsResult: QueryResult = await wordData.getUserwordsInText(userId, textId, simple);
  const newWordsResult = wordsResult.rows;

  await Promise.all(newWordsResult.map(async (item) => {
    const translations = await translationData.getByWord(item.word, userId);
    const status = await wordData.getStatus(item.id, userId);
    // eslint-disable-next-line no-param-reassign
    item.translations = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const translation of translations.rows) {
      item.translations.push(translation.translation);
      item.status = status.rows[0].word_status;
    }
  }));

  return newWordsResult;
};

const getWordInLanguage = async function (word: string, languageId: string): Promise<Word | null> {
  const result: QueryResult = await wordData.getWordInLanguage(word, languageId);

  if (result.rowCount === 0) return null;

  return convertWordTypes(result.rows[0]);
};


const addNew = async function(wordObject: Word): Promise<Word> {
  const result: QueryResult = await wordData.addNew(wordObject);

  if (result.rowCount === 0) throw boom.badRequest('Could not add new word.');

  return convertWordTypes(result.rows[0]);
};


const remove = async function(wordId: number): Promise<Word> {
  const result: QueryResult = await wordData.remove(wordId);

  if (result.rowCount === 0) throw boom.badRequest('Could not remove word.');

  return convertWordTypes(result.rows[0]);
};


const getStatus = async function(wordId: number, userId: number): Promise<string> {
  const result: QueryResult = await wordData.getStatus(wordId, userId);

  if (result.rowCount === 0) throw boom.badRequest('Could not get word status.');

  return result.rows[0].word_status;
};


const addStatus = async function(wordId: number, userId: number, wordStatus: string): Promise<string> {
  const result: QueryResult = await wordData.addStatus(wordId, userId, wordStatus);

  if (result.rowCount === 0) throw boom.badRequest('Could not add status to word.');

  return result.rows[0].word_status;
};


const updateStatus = async function(wordId: number, userId: number, wordStatus: string): Promise<string> {
  const result: QueryResult = await wordData.updateStatus(wordId, userId, wordStatus);

  if (result.rowCount === 0) throw boom.badRequest('Could not update word status.');

  return result.rows[0].word_status;
};


export default {
  getAll,
  getById,
  getByLanguageAndUser,
  getUserwordsInText,
  getWordInLanguage,
  addNew,
  remove,
  getStatus,
  addStatus,
  updateStatus,
};
