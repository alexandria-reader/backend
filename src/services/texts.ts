import dbQuery from '../model/db-query';

const getAll = async function() {
  const FIND_ALL_TEXTS = 'SELECT * FROM texts';
  const result = await dbQuery(FIND_ALL_TEXTS);
  return result.rows;
};

const getOne = async function(textId: number) {
  const FIND_TEXT = 'SELECT * FROM texts WHERE id = %L';
  const result = await dbQuery(FIND_TEXT, textId);
  return result.rows[0];
};


export default {
  getAll,
  getOne,
};
