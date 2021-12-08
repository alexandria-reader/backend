import dbQuery from '../model/db-query';
import { Text, TextDB, convertTextTypes } from '../types';


const getAll = async function(): Promise<Array<Text> | null> {
  const ALL_TEXTS: string = `
    SELECT * FROM texts`;

  const result = await dbQuery(ALL_TEXTS);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: TextDB) => convertTextTypes(dbItem));
};


const getOne = async function(textId: number): Promise<Text | null> {
  const TEXT_BY_ID: string = `
    SELECT * FROM texts WHERE id = %L`;

  const result = await dbQuery(TEXT_BY_ID, textId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


const addNew = async function(textData: Text) {
  const {
    userId,
    languageId,
    title,
    author,
    body,
    sourceURL,
    sourceType,
  } = textData;

  const ADD_TEXT: string = `
    INSERT INTO texts 
    (user_id, language_id, title, author, body, ts_config, source_url, source_type)
    VALUES 
    (%s, %L, %L, %L, %L, %L, %L, %L)`;

  const tsConfig = 'english';

  await dbQuery(
    ADD_TEXT,
    userId,
    languageId,
    title,
    author || null,
    body,
    tsConfig,
    sourceURL || null,
    sourceType || null,
  );
};


export default {
  getAll,
  getOne,
  addNew,
};
