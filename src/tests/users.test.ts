import fs from 'fs';
import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';

const api = supertest(app);

const reset = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs.readFileSync('./src/model/seed.sql', 'utf-8');

let authorization: string;

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);

  const data = {
    email: 'dana@example.com',
    password: 'danapwhash',
  };

  const response = await api.post('/api/login').send(data);
  authorization = `bearer ${response.body.token}`;
});

describe('Testing adding users', () => {
  test('users are returned as json, there are 2 users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  test('users are successfully added', async () => {
    const newUser = {
      username: 'test user',
      password: '12345',
      email: 'test@userRouter.com',
      knownLanguageId: 'de',
      learnLanguageId: 'fr',
    };

    const newUserResponse = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(newUserResponse.text).toContain('test user');
    expect(newUserResponse.text).toContain('fr');

    const usersResponse = await api
      .get('/api/users')
      .expect(200)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/);

    expect(usersResponse.body).toHaveLength(3);
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
      .put('/api/users/3')
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
      .put('/api/users/3')
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
      .delete('/api/users/')
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
