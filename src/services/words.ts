import dbQuery from '../model/db-query';

const getAll = async function() {
  const FIND_ALL_WORDS = 'SELECT * FROM words';
  const result = await dbQuery(FIND_ALL_WORDS);
  return result.rows;
};

const getOne = async function(wordId: number) {
  const FIND_WORD = 'SELECT * FROM words WHERE id = %L';
  const result = await dbQuery(FIND_WORD, wordId);
  return result.rows[0];
};

const getSome = async function(languageId: number, userId: number) {
  const FIND_WORDS = 'SELECT * FROM words AS w JOIN users_words AS uw ON w.id = uw.word_id WHERE w.language_id = %L AND uw.user_id = %L';
  const result = await dbQuery(FIND_WORDS, languageId, userId);
  return result.rows[0];
};


export default {
  getAll,
  getOne,
  getSome,
};
