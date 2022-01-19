/* eslint-disable max-len */
import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import wordData from '../data-access/words';
import translations from './translations';
import {
  Word, convertWordTypes, UserWord, SanitizedUser, Translation,
} from '../types';


const getUserwordsInText = async function(userId: number, textId: number, targetLanguageId: string, simple: boolean = true): Promise<Array<UserWord>> {
  const wordsResult: QueryResult = await wordData.getUserwordsInText(userId, textId, targetLanguageId, simple);

  const rawUserWords = wordsResult.rows;

  const userWords = rawUserWords.map((rawWord) => ({
    id: rawWord.word_id,
    word: rawWord.word,
    status: rawWord.status,
    translations: rawWord.translation_ids.map((id: number, index: number) => ({
      id,
      wordId: rawWord.word_id,
      targetLanguageId,
      translation: rawWord.translation_texts[index],
      context: rawWord.translation_contexts[index],
    })),
  }));

  return userWords;
};


const getUserwordsByLanguage = async function(languageId: string, userId: number): Promise<Array<UserWord>> {
  const wordsResult: QueryResult = await wordData.getUserwordsByLanguage(languageId, userId);

  const rawUserWords = wordsResult.rows;

  const userWords = rawUserWords.map((rawWord) => ({
    id: rawWord.word_id,
    word: rawWord.word,
    status: rawWord.status,
    translations: rawWord.translation_ids.map((id: number, index: number) => ({
      id,
      wordId: rawWord.word_id,
      targetLanguageId: rawWord.language_ids[index],
      translation: rawWord.translation_texts[index],
      context: rawWord.translation_contexts[index],
    })),
  }));

  return userWords;
};


const addNew = async function(wordObject: Word): Promise<Word> {
  const result: QueryResult = await wordData.addNew(wordObject);

  if (result.rowCount === 0) throw boom.badRequest('Could not add new word.');

  return convertWordTypes(result.rows[0]);
};


const addStatus = async function(wordId: number, userId: number, wordStatus: string): Promise<string> {
  const result: QueryResult = await wordData.addStatus(wordId, userId, wordStatus);

  if (result.rowCount === 0) throw boom.badRequest('Could not add status to word.');

  return result.rows[0].word_status;
};


const addNewUserWord = async function(user: SanitizedUser, userWordData: UserWord): Promise<UserWord> {
  const returnUserWord = userWordData;

  const newWordData: Word = {
    word: userWordData.word,
    languageId: user.learnLanguageId,
  };

  const newWord: Word = await addNew(newWordData);

  if (newWord.id && user.id) {
    returnUserWord.id = newWord.id;
    await addStatus(newWord.id, user.id, userWordData.status);

    const uwdTranslation = userWordData.translations[0];

    const newTranslation: Translation = await translations.add(
      newWord.id,
      uwdTranslation.translation,
      uwdTranslation.targetLanguageId,
    );

    if (newTranslation.id) {
      returnUserWord.translations[0].id = newTranslation.id;
      await translations.addToUsersTranslations(user.id, newTranslation.id, uwdTranslation.context);
    }
  }

  return returnUserWord;
};


const updateStatus = async function(wordId: number, userId: number, wordStatus: string): Promise<string> {
  const result: QueryResult = await wordData.updateStatus(wordId, userId, wordStatus);

  if (result.rowCount === 0) throw boom.badRequest('Could not update word status.');

  return result.rows[0].word_status;
};


const removeUserWord = async function(wordId: number, userId: number): Promise<string> {
  const result: QueryResult = await wordData.removeUserWord(wordId, userId);

  if (result.rowCount === 0) throw boom.badRequest('Could not remove status.');

  return result.rows[0].word_status;
};


export default {
  getUserwordsInText,
  getUserwordsByLanguage,
  addNew,
  addStatus,
  updateStatus,
  removeUserWord,
  addNewUserWord,
};
