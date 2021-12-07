import dbQuery from '../model/db-query';

export const getAllTexts = async function() {
  const SELECT_ALL_TEXTS = 'SELECT * FROM texts';
  const result = await dbQuery(SELECT_ALL_TEXTS);
  return result;
};

export const postText = function() {

};
