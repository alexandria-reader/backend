import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import before from '../model/test-db-before';
import resetDatabase from '../model/test-db-reset';

const api = supertest(app);

beforeAll(async () => {
  before.forEach(async (query) => {
    await dbQuery(query);
  });
});

describe('Testing getting all words', () => {
  beforeAll(async () => {
    await api.get('/api/words');
  });

  test('retrieve all words', async () => {
    await api
      .get('/api/words/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body.length).toEqual(10);
      });
  });

  test('retrieve word by id', async () => {
    await api
      .get('/api/words/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body.word).toEqual("of course");
      });
  });

  test('retrieve word by language and user id', async () => {
    await api
      .get('/api/words/en/user/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body[0].word).toEqual("of course");
      });
  });
});

// One more route to test
// describe('Testing adding a word', () => {
//   test('add a new word', async () => {
//     const word = {
//       languageId: 'en',
//       word: 'hellotest',
//     };

//     await api
//       .post('/api/words/user/1')
//       .send(word)
//       .expect(200);
//   });
// });

describe('Testing updating a word', () => {
  test('modify an existing word', async () => {
    const data = { status: 'known' };
    await api
      .put('/api/words/word/1/user/1')
      .send(data)
      .expect(200)
      .expect('known');
  });
});


afterAll(async () => {
  await dbQuery(resetDatabase);
});


