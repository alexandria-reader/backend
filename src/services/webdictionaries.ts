/* eslint-disable max-len */
import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import webdictionaryData from '../data-access/webdictionaries';
import { WebdictionaryDB, Webdictionary, convertWebdictionaryTypes } from '../types';


const getAll = async function(): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getAll();

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getById = async function(webdictionaryId: number): Promise<Webdictionary> {
  const result: QueryResult = await webdictionaryData.getById(webdictionaryId);

  if (result.rowCount === 0) throw boom.notFound('Could not find webdictionary with this id.');

  return convertWebdictionaryTypes(result.rows[0]);
};


const getBySource = async function(sourceLanguageId: string): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getBySource(sourceLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getByTarget = async function(targetLanguageId: string): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getByTarget(targetLanguageId);

  return result.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
};


const getBySourceTarget = async function(sourceLanguageId: string, targetLanguageId: string): Promise<Array<Webdictionary>> {
  const result: QueryResult = await webdictionaryData.getBySourceTarget(sourceLanguageId, targetLanguageId);

  if (result.rowCount === 0) {
    const alternativeResult: QueryResult = await webdictionaryData.getBySource(sourceLanguageId);
    return alternativeResult.rows.map((dbItem: WebdictionaryDB) => convertWebdictionaryTypes(dbItem));
  }

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
  getById,
  getBySource,
  getByTarget,
  getBySourceTarget,
  addNew,
  getPrefWebdicts,
};
