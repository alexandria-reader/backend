/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import { WebdictionaryDB, Webdictionary, convertWebdictionaryTypes } from '../types';


const getAll = async function (): Promise<Array<Webdictionary>> {
  const ALL_DICTIONARIES: string = `
    SELECT * FROM webdictionaries`;

  const result = await dbQuery(ALL_DICTIONARIES);

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


const getBySource = async function (sourceLanguageId: string): Promise<Array<Webdictionary>> {
  const DICTIONARIES_BY_SOURCE: string = `
    SELECT * FROM webdictionaries
     WHERE source_language_id = %L`;

  const result = await dbQuery(DICTIONARIES_BY_SOURCE, sourceLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


const getByTarget = async function (targetLanguageId: string): Promise<Array<Webdictionary>> {
  const DICTIONARIES_BY_TARGET: string = `
    SELECT * FROM webdictionaries
     WHERE target_language_id = %L`;

  const result = await dbQuery(DICTIONARIES_BY_TARGET, targetLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


const getPrefWebdicts = async function getPreferredWebdictionaries(userId: number): Promise<Array<Webdictionary>> {
  const PREFERRED_WEBDICTIONARIES: string = `
    SELECT wd.id,
           source_language_id, 
           target_language_id, 
           name, 
           url FROM webdictionaries AS wd
      JOIN webdictionary_preferencess AS wp ON wp.webdictionary_id = wd.id 
     WHERE wp.user_id = %s`;

  const result = await dbQuery(PREFERRED_WEBDICTIONARIES, userId);

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


const addWebdictionary = async function(webdictionaryData: Webdictionary): Promise<Webdictionary | null> {
  const {
    sourceLanguageId,
    targetLanguageId,
    name,
    url,
  } = webdictionaryData;

  const ADD_WEBDICTIONARY: string = `
    INSERT INTO webdictionaries (source_language_id, target_language_id, "name", "url")
         VALUES (%L, %L, %L, %L)
      RETURNING *`;

  const result = await dbQuery(
    ADD_WEBDICTIONARY,
    sourceLanguageId,
    targetLanguageId,
    name,
    url,
  );

  if (result.rowCount === 0) return null;

  return convertWebdictionaryTypes(result.rows[0]);
};


export default {
  getAll,
  getBySource,
  getByTarget,
  addWebdictionary,
  getPrefWebdicts,
};
