import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import languageData from '../data-access/languages';
import { LanguageDB, Language, convertLanguageTypes } from '../types';

const getAll = async function(): Promise<Array<Language>> {
  const result: QueryResult = await languageData.getAll();

  return result.rows.map((dbItem: LanguageDB) => convertLanguageTypes(dbItem));
};


const getById = async function(languageId: string): Promise<Language> {
  const result: QueryResult = await languageData.getById(languageId);

  if (result.rowCount === 0) throw boom.notFound('Could not find language with this id.');

  return convertLanguageTypes(result.rows[0]);
};


const addNew = async function(languageObject: Language): Promise<Language> {
  const result: QueryResult = await languageData.addNew(languageObject);

  if (result.rowCount === 0) throw boom.notFound('Could not add language.');

  return convertLanguageTypes(result.rows[0]);
};


export default {
  getAll,
  getById,
  addNew,
};
