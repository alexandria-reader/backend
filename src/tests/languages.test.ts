import fs from 'fs';
import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import languages from '../data-access/languages';

const api: supertest.SuperTest<supertest.Test> = supertest(app);

const reset: string = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed: string = fs.readFileSync('./src/model/seed.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});


describe('LANGUAGE DATA ACCESS', () => {
  test('getById: language with id "en" from test database', async () => {
    const language = await languages.getById('en');

    expect(language.rows[0].name).toMatch('english');
  });
});


describe('LANGUAGES ROUTES AND SERVICES', () => {
  test('Languages are returned as json.', async () => {
    await api
      .get('/api/languages/')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('First language is English, last language is Turkish', async () => {
    await api
      .get('/api/languages/')
      .expect((response) => {
        expect(response.body.length).toEqual(10);
        expect(response.body[0].id).toEqual('en');
        expect(response.body[9].id).toEqual('tr');
      });
  });

  test('If no languages exist, an error is thrown', async () => {
    await dbQuery(reset);
    await api
      .get('/api/languages/')
      .expect((response) => {
        expect(response.text).toContain('No languages available.');
      });
  });
});
