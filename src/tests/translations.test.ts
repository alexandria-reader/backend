import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import before from '../model/test-db-before';

const api = supertest(app);

beforeAll(async () => {
  before.forEach(async (query) => {
    await dbQuery(query);
  });
});

describe('Testing adding translations', () => {
  test('new translation is correctly added', async () => {
    await dbQuery('SELECT * FROM languages');
    const ADD_WORD = 'INSERT INTO words (language_id, word, ts_config) VALUES(%L, %L, %L) RETURNING *';
    const LAST_ADD_WORD = await dbQuery(ADD_WORD, 'en', 'hello', 'english');
    await dbQuery(`SELECT * FROM words WHERE id=11`);
    const LAST_ID = Number(LAST_ADD_WORD.rows[0].id);
    const newTranslation = {
      wordId: LAST_ID,
      translation: 'allo',
      targetLang: 'fr',
    };
    await api
      .post('/api/translations/user/1')
      .send(newTranslation)
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect("New translation added");
  });
});

describe('Testing deleting translations', () => {
  test('translation with specified id is deleted', async () => {
    // await dbQuery('SELECT * FROM languages');
    // const ADD_WORD = 'INSERT INTO words (language_id, word, ts_config) VALUES(%L, %L, %L) RETURNING *';
    // const LAST_ADD_WORD = await dbQuery(ADD_WORD, 'en', 'hello', 'english');
    // await dbQuery(`SELECT * FROM words WHERE id=11`);
    // const LAST_ID = Number(LAST_ADD_WORD.rows[0].id);
    // const newTranslation = {
    //   wordId: LAST_ID,
    //   translation: 'allo',
    //   targetLang: 'fr',
    // };
    await api
      .delete('/api/translations/23')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect("Translation deleted");
  });
});

describe('Testing updating translations', () => {
  
});

describe('Testing retrieving translations', () => {
});