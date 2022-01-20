import boom from '@hapi/boom';
import { QueryResult } from 'pg';
import textData from '../data-access/texts';
import { TextDB, Text, convertTextTypes } from '../types';


const getAll = async function(): Promise<Array<Text>> {
  const result: QueryResult = await textData.getAll();

  return result.rows.map((dbItem: TextDB) => convertTextTypes(dbItem));
};


const getById = async function(textId: number): Promise<Text> {
  const result: QueryResult = await textData.getById(textId);

  if (result.rowCount === 0) throw boom.notFound('Could not find text with this id.');

  return convertTextTypes(result.rows[0]);
};


const getByUserAndLanguage = async function(userId: number, languageId: string)
  : Promise<Array<Text>> {
  const result: QueryResult = await textData.getByUserAndLanguage(userId, languageId);

  return result.rows.map((dbItem: TextDB) => convertTextTypes(dbItem));
};


const addNew = async function(textObject: Text): Promise<Text> {
  const result: QueryResult = await textData.addNew(textObject);

  if (result.rowCount === 0) throw boom.badRequest('Could not add new text.');

  return convertTextTypes(result.rows[0]);
};


const update = async function(textObject: Text): Promise<Text> {
  const result: QueryResult = await textData.update(textObject);

  if (result.rowCount === 0) throw boom.badRequest('Could not update text.');

  return convertTextTypes(result.rows[0]);
};


const remove = async function(textId: number): Promise<Text> {
  const result: QueryResult = await textData.remove(textId);
  if (result.rowCount === 0) throw boom.badRequest('Could not remove text.');

  return convertTextTypes(result.rows[0]);
};


export default {
  getAll,
  getById,
  getByUserAndLanguage,
  addNew,
  update,
  remove,
};
