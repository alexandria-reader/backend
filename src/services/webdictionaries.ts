/* eslint-disable max-len */
import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import webdictionaryData from '../data-access/webdictionaries';
import { WebdictionaryDB, Webdictionary, convertWebdictionaryTypes } from '../types';

const getAll = async function(): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getAll();

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getBySource = async function(sourceLanguageId: string): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getBySource(sourceLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getByTarget = async function(targetLanguageId: string): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getByTarget(targetLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getPrefWebdicts = async function getPreferredWebdictionaries(userId: number): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getPrefWebdicts(userId);

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const addNew = async function(webdictionaryObject: Webdictionary): Promise<Webdictionary> {
  const result: QueryResult = await webdictionaryData.addNew(webdictionaryObject);

  if (result.rowCount === 0) throw boom.badRequest('Could not add webdictionary');

  return convertWebdictionaryTypes(result.rows[0]);
};


export default {
  getAll,
  getBySource,
  getByTarget,
  addNew,
  getPrefWebdicts,
};
