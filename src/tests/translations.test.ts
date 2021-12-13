import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import before from '../model/test-db-before';
import resetDatabase from '../model/test-db-reset';

const api = supertest(app);

// beforeAll(async () => {
//   await dbQuery(resetDatabase);
// });

beforeAll(async () => {
  before.forEach(async (query) => {
    console.log(query);
    await dbQuery(query);
  });
});

describe('Testing retrieving translations', () => {
  test('retrieve all translations', async () => {
    await api
      .get('/api/translations')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body.length).toEqual(0);
      });
  });

  test('retrieve all translations for user', async () => {
    await api
      .get('/api/translations/user/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body[0].translation).toEqual("natürlich");
      });
  });

  test('retrieve one translations by id', async () => {
    await api
      .get('/api/translations/2')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body.translation).toEqual("klar doch");
      });
  });

  test('retrieve translations by word id for user', async () => {
    await api
      .get('/api/translations/word/1/user/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body[0].translation).toEqual("natürlich");
      });
  });

  test('retrieve translation with specified id and target language', async () => {
    await api
      .get('/api/translations/word/4/target/fr')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body[0].translation).toEqual("toute la journée");
      });
  });
});

describe('Testing adding translations', () => {
  test('new translation is correctly added', async () => {
    await dbQuery('SELECT * FROM languages');
    const ADD_WORD = 'INSERT INTO words (language_id, word, ts_config) VALUES(%L, %L, %L) RETURNING *';
    const LAST_ADD_WORD = await dbQuery(ADD_WORD, 'en', 'hello', 'english');
    await dbQuery('SELECT * FROM words WHERE id=11');
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
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('New translation added');
  });
});

describe('Testing deleting translations', () => {
  test('translation with specified id is deleted', async () => {
    await api
      .delete('/api/translations/23')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Translation deleted');
  });
});

describe('Testing updating translations', () => {
  test('update translation with specified id', async () => {
    const updatedTranslation = {
      translation: 'affamé',
    };
    await api
      .put('/api/translations/translation/14')
      .send(updatedTranslation)
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Translation updated');
  });
});

afterAll(async () => {
  await dbQuery(resetDatabase);
});
