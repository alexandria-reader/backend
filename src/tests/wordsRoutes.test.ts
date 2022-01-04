import fs from 'fs';
import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';

const api = supertest(app);

const reset = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs.readFileSync('./src/model/seed.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});

xdescribe('Testing getting all words', () => {
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
        expect(response.body.word).toEqual('of course');
      });
  });

  test('retrieve word by language and user id', async () => {
    await api
      .get('/api/words/en/user/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        expect(response.body[0].word).toEqual('of course');
      });
  });
});

xdescribe('Testing adding a word', () => {
  test('add a new word', async () => {
    const word = {
      languageId: 'en',
      word: 'hellotest',
    };

    await api
      .post('/api/words/user/1')
      .send(word)
      .expect(201);
  });
});

xdescribe('Testing updating a word', () => {
  test('modify an existing word', async () => {
    const data = { status: 'learned' };
    await api
      .put('/api/words/1/user/1')
      .send(data)
      .expect(200)
      .expect('learned');
  });
});

xdescribe('Testing deleting a word', () => {
  test('delete an existing word', async () => {
    await api
      .delete('/api/words/1')
      .expect(204);
  });
});


afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});


