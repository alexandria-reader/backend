import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import resetDatabase from '../model/test-db-reset';

const api = supertest(app);

beforeAll(async () => {
  await dbQuery(resetDatabase);

  await dbQuery(`INSERT INTO users (username, password_hash, email)
  VALUES
  ('eamon', 'eamonpwhash', 'eamon@example.com'),
  ('dana', 'danapwhash', 'dana@example.com'),
  ('marc', 'marcpwhash', 'marc@example.com');

  INSERT INTO languages (id, "name") 
  VALUES
  ('en', 'english'),
  ('de', 'german'),
  ('fr', 'french');
  `);
});

describe('Testing adding texts', () => {
  test('Texts are returned as json, there are no users', async () => {
    const response = await api
      .get('/api/texts')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(0);
  });

  test('A text is added successfully', async () => {
    const text = {
      userId: 1,
      languageId: 'en',
      title: 'The Little Match Girl',
      body: 'It was so terribly cold.',
    };

    const response = await api
      .post('/api/texts')
      .send(text)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toMatch(/The Little Match Girl/);
  });

  test('Texts can be found by id', async () => {
    const response = await api
      .get('/api/texts/1')
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
      .send(text)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toMatch(/The Little Match Boy/);
  });
});

afterAll(async () => {
  await dbQuery(resetDatabase);
});
