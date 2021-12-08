import dbQuery from '../model/db-query';

const getAll = async function() {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations';
  const results = await dbQuery(FIND_TRANSLATIONS);
  return results.rows;
};

const getOne = async function(translationId: number) {
  const FIND_TRANSLATION = 'SELECT * FROM translations WHERE id = %L';
  const result = await dbQuery(FIND_TRANSLATION, translationId);
  return result.rows[0];
};

const getSome = async function(wordId: number, userId: number) {
  const FIND_WORD_INFO = 'SELECT * FROM words JOIN users_words ON words.id = users_words.word_id WHERE words.id = %L AND users_words.user_id = %L';
  const result = await dbQuery(FIND_WORD_INFO, wordId, userId);
  return result.rows;
};

const getDictionaries = async function(sourceId: string, targetId: string) {
  const FIND_LANG_PAIR = 'SELECT * FROM languagepairs WHERE source_language_id = %L AND target_language_id = %L';
  const languagePairQuery = await dbQuery(FIND_LANG_PAIR, sourceId, targetId);
  const languagePairId = Number(languagePairQuery.rows[0].id);

  const FIND_DICTIONARIES = 'SELECT * FROM webdictionaries WHERE id = %L';
  const result = await dbQuery(FIND_DICTIONARIES, languagePairId);
  return result.rows[0];
};

const getAllForOneWord = async function(wordId: number, targetId: string) {
  const FIND_DICTIONARIES = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
  const result = await dbQuery(FIND_DICTIONARIES, wordId, targetId);
  return result.rows[0];
};

const postOne = async function(
  wordId: number,
  translation: string,
  targetLanguageId: number,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L)';
  const result = await dbQuery(INSERT_TRANSLATION, wordId, translation, targetLanguageId);
  return result;
};

export default {
  getAll,
  getOne,
  getSome,
  getDictionaries,
  getAllForOneWord,
  postOne,
};
