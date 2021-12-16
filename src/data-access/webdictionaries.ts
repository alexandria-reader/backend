/* eslint-disable max-len */
import { QueryResult } from 'pg';
import dbQuery from '../model/db-query';
import { Webdictionary } from '../types';


const getAll = async function(): Promise<QueryResult> {
  const ALL_DICTIONARIES: string = `
    SELECT * FROM webdictionaries`;

  const result = await dbQuery(ALL_DICTIONARIES);

  return result;
};


const getById = async function(webdictionaryId: number): Promise<QueryResult> {
  const WEBDICTIONARY_BY_ID: string = `
    SELECT * FROM webdictionaries
     WHERE id = %s`;

  const result = await dbQuery(WEBDICTIONARY_BY_ID, webdictionaryId);

  return result;
};


const getBySource = async function getBySourceLanguage(sourceLanguageId: string): Promise<QueryResult> {
  const DICTIONARIES_BY_SOURCE: string = `
    SELECT * FROM webdictionaries
     WHERE source_language_id = %L`;

  const result = await dbQuery(DICTIONARIES_BY_SOURCE, sourceLanguageId);

  return result;
};


const getByTarget = async function getByTargetLanguage(targetLanguageId: string): Promise<QueryResult> {
  const DICTIONARIES_BY_TARGET: string = `
    SELECT * FROM webdictionaries
     WHERE target_language_id = %L`;

  const result = await dbQuery(DICTIONARIES_BY_TARGET, targetLanguageId);

  return result;
};


const getPrefWebdicts = async function getPreferredWebdictionaries(userId: number): Promise<QueryResult> {
  const PREFERRED_WEBDICTIONARIES: string = `
    SELECT wd.id,
           source_language_id, 
           target_language_id, 
           name, 
           url FROM webdictionaries AS wd
      JOIN webdictionary_preferencess AS wp ON wp.webdictionary_id = wd.id 
     WHERE wp.user_id = %s`;

  const result = await dbQuery(PREFERRED_WEBDICTIONARIES, userId);

  return result;
};


const addNew = async function(webdictionaryObject: Webdictionary): Promise<QueryResult> {
  const {
    sourceLanguageId,
    targetLanguageId,
    name,
    url,
  } = webdictionaryObject;

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

  return result;
};


export default {
  getAll,
  getById,
  getBySource,
  getByTarget,
  addNew,
  getPrefWebdicts,
};
