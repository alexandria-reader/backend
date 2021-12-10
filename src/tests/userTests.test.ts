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

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('User test user succesfully created');
  });

  // the error handling needs work before this can be implemented
  // test('duplicate users are not added', async () => {
  //   const newUser = {
  //     username: 'test user',
  //     password: '12345',
  //     email: 'test@userRouter.com',
  //   };

  //   await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(200)
  //     .expect('User test user succesfully created');
  // });
});

