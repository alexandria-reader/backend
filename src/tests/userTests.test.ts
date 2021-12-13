import supertest from 'supertest';
import app from '../app';
import dbQuery from '../model/db-query';
import resetDbCommands from '../model/test-db-reset';

const api = supertest(app);

beforeAll(async () => {
  resetDbCommands.forEach(async (query) => {
    await dbQuery(query);
  });
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

  // this test keeps jest from exiting
  test('duplicate users are not added', async () => {
    const newUser = {
      username: 'test user',
      password: '12345',
      email: 'test@userRouter.com',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Username already taken');
  });
});

