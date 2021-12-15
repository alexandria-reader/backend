import dbQuery from '../model/db-query';

const addContext = async function(
  snippet: string,
  translationId: number,
) {
  const INSERT_CONTEXT = 'INSERT INTO contexts ( translation_id, snippet) VALUES (%L, %L) RETURNING *';
  const results = await dbQuery(INSERT_CONTEXT, translationId, snippet);
  return results;
};

const getAllContextByWordByLang = async function
(word: string, sourceLanguage: string, targetLanguage: string) {
  const FIND_WORD_ID = 'SELECT * FROM words WHERE word = %L AND language_id = %L';
  const foundWord = await dbQuery(FIND_WORD_ID, word, sourceLanguage);
  const foundWordId = await foundWord.rows[0].id;
  const FIND_TRANS_ID = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
  const foundTrans = await dbQuery(FIND_TRANS_ID, foundWordId, targetLanguage);
  const foundTransId = await foundTrans.rows[0].id;
  const FIND_CONTEXT = 'SELECT * FROM contexts WHERE translation_id = %L';
  const results = await dbQuery(FIND_CONTEXT, foundTransId);
  return results;
};

const getContextByLangByUser = async function
(userId: number, wordId: number, targetLanguageId: string) {
  const FIND_CONTEXT = `SELECT * FROM contexts 
        JOIN (SELECT * FROM translations JOIN users_translations 
          ON translations.id = users_translations.translation_id 
          WHERE users_translations.user_id = %L 
          AND translations.word_id = %L 
          AND translations.target_language_id = %L) as translations
          ON contexts.translation_id = translations.translation_id`;
  const results = await dbQuery(FIND_CONTEXT, userId, wordId, targetLanguageId);
  return results;
};

export default {
  addContext,
  getAllContextByWordByLang,
  getContextByLangByUser,
};
