import dbQuery from '../model/db-query';

const getAllByUser = async function(userId: number) {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations AS t JOIN users_translations AS ut ON t.id = ut.translation_id AND user_id = %L';
  const results = await dbQuery(FIND_TRANSLATIONS, userId);
  return results.rows;
};

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

const getByWord = async function(wordId: number, userId: number) {
  const FIND_WORD_INFO = 'SELECT * FROM words JOIN users_words ON words.id = users_words.word_id WHERE words.id = %L AND users_words.user_id = %L';
  const result = await dbQuery(FIND_WORD_INFO, wordId, userId);
  return result.rows[0];
};

const getAllByWordByLang = async function(wordId: number, langId: string) {
  const FIND_TRANSLATIONS = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
  const result = await dbQuery(FIND_TRANSLATIONS, wordId, langId);
  return result.rows[0];
};

const getAllContextByLang = async function(wordId: number, langId: string) {
  const FIND_CONTEXT = 'SELECT * FROM (SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L) AS translations JOIN contexts ON translations.id = contexts.translation_id';
  const result = await dbQuery(FIND_CONTEXT, wordId, langId);
  return result.rows;
};

const getContextByLangByUser = async function(userId: number, wordId: number, langId: string) {
  const FIND_CONTEXT_BY_USER = 'SELECT * FROM contexts JOIN (SELECT * FROM translations JOIN users_translations ON translations.id = users_translations.translation_id WHERE users_translations.user_id = %L AND translations.word_id = %L AND translations.target_language_id = %L) as translations ON contexts.translation_id = translations.translation_id';
  const result = await dbQuery(FIND_CONTEXT_BY_USER, userId, wordId, langId);
  return result.rows[0];
};

const add = async function(
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
  const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id) VALUES(%L, %L) RETURNING users_translations.*';
  const result = await dbQuery(USER_TRANSLATION, userId, lastInsertionId);
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
  const REMOVE_USERS_TRANSLATIONS = 'DELETE FROM users_translations WHERE translation_id = %L';
  await dbQuery(REMOVE_USERS_TRANSLATIONS, translationId);
  const REMOVE_TRANSLATION = 'DELETE FROM translations WHERE id = %L RETURNING translations.*';
  const result = await dbQuery(REMOVE_TRANSLATION, translationId);
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
