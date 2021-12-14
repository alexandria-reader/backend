import dbQuery from '../model/db-query';
import { Text, TextDB, convertTextTypes } from '../types';


const getAll = async function(): Promise<Array<Text>> {
  const ALL_TEXTS: string = `
    SELECT * FROM texts`;

  const result = await dbQuery(ALL_TEXTS);

  return result.rows.map((dbItem: TextDB) => convertTextTypes(dbItem));
};


const getById = async function(textId: number): Promise<Text | null> {
  const TEXT_BY_ID: string = `
    SELECT * FROM texts 
     WHERE id = %s`;

  const result = await dbQuery(TEXT_BY_ID, textId);

  if (result.rowCount === 0) return null;

  return convertTextTypes(result.rows[0]);
};


const getByUser = async function(userId: number): Promise<Array<Text> | null> {
  const TEXTS_BY_USER: string = `
    SELECT * FROM texts
     WHERE user_id = %s`;

  const result = await dbQuery(TEXTS_BY_USER, userId);

  if (result.rowCount === 0) return null;

  return result.rows.map((dbItem: TextDB) => convertTextTypes(dbItem));
};


const addNew = async function(textData: Text): Promise<Text> {
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
    INSERT INTO texts (user_id, language_id, title, author,
                       body, ts_config, source_url, source_type)
         VALUES (%s, %L, %L, %L, %L, 
                 (SELECT "name" FROM languages AS l WHERE l.id = %L)::regconfig, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_TEXT,
    userId,
    languageId,
    title,
    author || null,
    body,
    languageId,
    sourceURL || null,
    sourceType || null,
  );

  return convertTextTypes(result.rows[0]);
};


const update = async function(textData: Text): Promise<Text | null> {
  const {
    id,
    userId,
    languageId,
    title,
    author,
    body,
    sourceURL,
    sourceType,
  } = textData;

  const ADD_TEXT: string = `
       UPDATE texts 
          SET user_id = %s, 
              language_id = %L, 
              title = %L, 
              author = %L, 
              body = %L, 
              source_url = %L, 
              source_type = %L
        WHERE id = %s 
    RETURNING *`;

  const result = await dbQuery(
    ADD_TEXT,
    userId,
    languageId,
    title,
    author || null,
    body,
    sourceURL || null,
    sourceType || null,
    id,
  );

  return convertTextTypes(result.rows[0]);
};


const remove = async function(textId: number): Promise<Text | null> {
  const REMOVE_TEXT: string = `
  DELETE FROM texts 
        WHERE id = %s
    RETURNING *`;

  const result = await dbQuery(REMOVE_TEXT, textId);

  if (result.rowCount === 0) return null;

  return convertTextTypes(result.rows[0]);
};


export default {
  getAll,
  getById,
  getByUser,
  addNew,
  update,
  remove,
};
