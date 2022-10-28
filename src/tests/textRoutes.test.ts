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

describe('Testing adding texts', () => {
  let token = '';

  beforeAll(async () => {
    const loginDetails = {
      password: 'password',
      email: 'eamon@example.com',
    };
    const response = await api.post('/api/login').send(loginDetails);
    token = response.body.token;
  });

  test('A text is added successfully', async () => {
    const text = {
      userId: 1,
      languageId: 'en',
      title: 'The Little Match Girl',
      body: 'It was so terribly cold.',
    };
    console.log(api);
    console.log(token);
    const response = await api
      .post('/api/texts')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    console.log(response);
    expect(response.text).toMatch(/The Little Match Girl/);
  });

  test('Texts can be found by id', async () => {
    const response = await api
      .get('/api/texts/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toMatch(/The Little Match Girl/);
  });

  test('Texts can be updated', async () => {
    const text = {
      userId: 1,
      languageId: 'en',
      title: 'The Little Match Boy',
      body: 'It was so terribly cold.',
    };

    const response = await api
      .put('/api/texts/1')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toMatch(/The Little Match Boy/);
  });
});

afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});
