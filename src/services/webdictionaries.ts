/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import { WebdictionaryDB, Webdictionary, convertWebdictionaryTypes } from '../types';


const addWebdictionary = async function(languagepairId: number, name: string, url: string): Promise<void> {
  const ADD_WEBDICTIONARY: string = `
    INSERT INTO webdictionaries
    (language_pair_id, "name", "url")
    VALUES
    (%s, %L, %L)`;

  await dbQuery(
    ADD_WEBDICTIONARY,
    languagepairId,
    name,
    url,
  );
};


const getWebdictsByPair = async function getWebdictionariesByLanguagePair(languagepairId: number): Promise<Array<Webdictionary> | null> {
  const DICTIONARIES_BY_PAIR: string = `
    SELECT * FROM webdictionaries
    WHERE language_pair_id = %s`;

  const result = await dbQuery(DICTIONARIES_BY_PAIR, languagepairId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


const getPrefWebdicts = async function getPreferredWebdictionaries(userId: number): Promise<Array<Webdictionary> | null> {
  const PREFERRED_WEBDICTIONARIES: string = `
    SELECT wd.id, language_pair_id, source_language_id, target_language_id, name, url FROM webdictionaries AS wd
    JOIN languagepairs AS lp ON wd.language_pair_id = lp.id
    `;

  const result = await dbQuery(PREFERRED_WEBDICTIONARIES, userId);
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.map((dbItem: WebdictionaryDB): Webdictionary => convertWebdictionaryTypes(dbItem));
};


export default {
  addWebdictionary,
  getPrefWebdicts,
  getWebdictsByPair,
};