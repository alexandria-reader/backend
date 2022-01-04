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

describe('Testing adding users', () => {
  xtest('users are returned as json, there are no users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(0);
  });

  test('users are successfully added', async () => {
    const newUser = {
      username: 'test user',
      password: '12345',
      email: 'test@userRouter.com',
      knownLanguageId: 'de',
      learnLanguageId: 'fr',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('test user');
    expect(response.text).toContain('fr');
  });

  xtest('There is one user', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(1);
  });

  xtest('duplicate usernames are not added', async () => {
    const newUser = {
      username: 'test user',
      password: '12345',
      email: 'test1@userRouter.com',
      knownLanguageId: 'de',
      learnLanguageId: 'fr',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Email already in use.');
  });

  test('duplicate emails are not added', async () => {
    const newUser = {
      username: 'test user1',
      password: '12345',
      email: 'test@userRouter.com',
      knownLanguageId: 'de',
      learnLanguageId: 'fr',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Email already in use');
  });

  xtest('users can change passwords', async () => {
    const password = {
      password: '12345',
      newPassword: 'password',
    };

    await api
      .put('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Your password has been updated"}');
  });

  xtest('users cant change passwords unless correct password is supplied', async () => {
    const password = {
      password: '123456',
      newPassword: 'password',
    };

    const response = await api
      .put('/api/users/1')
      .send(password)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Incorrect password');
  });

  xtest('users cannot delete account unless correct password is supplied', async () => {
    const password = {
      password: 'wrong',
    };

    await api
      .delete('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Passwords do not match"}');
  });

  xtest('users are successfully deleted', async () => {
    const password = {
      password: 'password',
    };

    const response = await api
      .delete('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toMatch(/test user/);
  });

  xtest('After deletion, there are no users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(0);
  });
});

afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});
