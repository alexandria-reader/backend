import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import resetDatabase from '../model/test-db-reset';

const api = supertest(app);

beforeAll(async () => {
  await dbQuery(resetDatabase);
});

describe('Testing adding users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
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

  // test('users are successfully deleted', async () => {
  //   const response = await api
  //     .post('/api/users/1')
  //     .send(newUser)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/);

  //   expect(response.text).toContain('test user');
  // });

  // test changing password
});

afterAll(async () => {
  await dbQuery(resetDatabase);
});
