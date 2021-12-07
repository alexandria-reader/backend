// generic database query function, takes SQL statement and parameters

import { Client } from 'pg';
import format from 'pg-format';
import config from '../lib/config';
import { ConnectionOptions } from '../types';

const logQuery = function(statement: string):void {
  const timeStamp: Date = new Date();
  const formattedTimeStamp: string = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement);
};

const isProduction: boolean = (config.NODE_ENV === 'production');
const isStaging: boolean = (config.NODE_ENV === 'staging');

const CONNECTION: ConnectionOptions = {
  connectionString: isStaging ? config.STAGING_DATABASE_URL : config.DATABASE_URL,
  ssl: (isProduction || isStaging) ? { rejectUnauthorized: false } : false,
};

export default async function(statement: string, ...parameters: any) {
  const sql = format(statement, ...parameters);
  const client = new Client(CONNECTION);

  await client.connect();

  logQuery(sql);

  const result = await client.query(sql);
  await client.end();

  return result;
}
