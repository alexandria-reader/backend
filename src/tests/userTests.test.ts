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
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"User test user succesfully created"}');
  });

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  // this test keeps jest from exiting
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
  //     .expect('Content-Type', /application\/json/)
  //     .expect('{"message":"Name already exists"}');
  // });

  test('users are successfully deleted', async () => {
    const password = {
      password: '12345',
    };

    await api
      .delete('/api/users/1')
      .send(password)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"User test user succesfully created"}');
  });
});

