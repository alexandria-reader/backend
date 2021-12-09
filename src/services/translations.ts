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

// Move to webdictionaries services
// const getDictionaries = async function(pairId: number) {
//   const FIND_LANG_PAIR = 'SELECT * FROM webdictionaries WHERE language_pair_id = %L';
//   const result = await dbQuery(FIND_LANG_PAIR, pairId);
//   return result.rows;
// };

const getAllForOneWord = async function(wordId: number, targetId: string) {
  const FIND_DICTIONARIES = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
  const result = await dbQuery(FIND_DICTIONARIES, wordId, targetId);
  return result.rows[0];
};

const postOne = async function(
  userId: number,
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L)';
  await dbQuery(INSERT_TRANSLATION, wordId, translation, targetLang);
  const LAST_INSERTION = 'SELECT * FROM translations WHERE id=(SELECT max(id) FROM translations)';
  const resultLastInsertion = await dbQuery(LAST_INSERTION);
  const lastInsertionId = resultLastInsertion.rows[0].id;
  const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id) VALUES(%L, %L)';
  const result = await dbQuery(USER_TRANSLATION, userId, lastInsertionId);
  return result;
};

const putOne = async function(
  userId: number,
  wordId: number,
  translation: string,
  targetLang: string,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L)';
  await dbQuery(INSERT_TRANSLATION, wordId, translation, targetLang);
  const LAST_INSERTION = 'SELECT * FROM translations WHERE id=(SELECT max(id) FROM translations)';
  const resultLastInsertion = await dbQuery(LAST_INSERTION);
  const lastInsertionId = resultLastInsertion.rows[0].id;
  const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id) VALUES(%L, %L)';
  const result = await dbQuery(USER_TRANSLATION, userId, lastInsertionId);
  return result;
};

export default {
  getAll,
  getOne,
  getSome,
  getAllForOneWord,
  postOne,
  putOne,
};
