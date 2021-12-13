import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import resetDatabase from '../model/test-db-reset';

const api = supertest(app);

beforeAll(async () => {
  await dbQuery(resetDatabase);
});

describe('Testing adding users', () => {
  test('users are returned as json, there are no users', async () => {
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
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('test user');
  });

  test('There is one user', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(1);
  });

  test('duplicate usernames are not added', async () => {
    const newUser = {
      username: 'test user',
      password: '12345',
      email: 'test1@userRouter.com',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Username already in use');
  });

  test('duplicate emails are not added', async () => {
    const newUser = {
      username: 'test user1',
      password: '12345',
      email: 'test@userRouter.com',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Email already in use');
  });

  test('users can change passwords', async () => {
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

  test('users cant change passwords unless correct password is supplied', async () => {
    const password = {
      password: '123456',
      newPassword: 'password',
    };

    await api
      .put('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Incorrect password"}');
  });

  test('users are successfully deleted', async () => {
    const password = {
      password: 'password',
    };

    await api
      .delete('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Your account has been deleted"}');
  });

  test('After deletion, there are no users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const responseBody = JSON.parse(response.text);
    expect(responseBody).toHaveLength(0);
  });
});

afterAll(async () => {
  await dbQuery(resetDatabase);
});
