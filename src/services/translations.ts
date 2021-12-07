import dbQuery from '../model/db-query';

const getOne = async function(translationId: number) {
  const FIND_TRANSLATION = 'SELECT * FROM translations WHERE id = %L';
  const result = await dbQuery(FIND_TRANSLATION, translationId);
  return result.rows[0];
};

const postOne = async function(
  id: number,
  wordId: number,
  translation: string,
  targetLanguageId: number,
) {
  const INSERT_TRANSLATION = 'INSERT INTO translations (id, word_id, translation, target_language_id) VALUES (%L, %L, %L, &L)';
  const result = await dbQuery(INSERT_TRANSLATION, id, wordId, translation, targetLanguageId);
  return result;
};

export default {
  getOne,
  postOne,
};
