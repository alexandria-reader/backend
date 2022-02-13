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

  test('logged in user returned after sending token', async () => {
    const response = await api
      .get('/api/users/from-token')
      .expect(200)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('dana@example.com');
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

  test('users can change passwords', async () => {
    let data = {
      currentPassword: 'danapwhash',
      newPassword: 'danapwmash',
    };

    await api
      .put('/api/users/change-password')
      .send(data)
      .expect(200)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Your password has been updated"}');

    data = {
      currentPassword: 'danapwmash',
      newPassword: 'danapwhash',
    };

    await api
      .put('/api/users/change-password')
      .send(data)
      .expect(200)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .expect('{"message":"Your password has been updated"}');
  });

  test('users cannot change passwords if wrong password is supplied', async () => {
    const data = {
      currentPassword: 'wrong password',
      newPassword: 'danapwmash',
    };

    const response = await api
      .put('/api/users/change-password')
      .send(data)
      .expect(406)
      .set('authorization', authorization)
      .expect('Content-Type', /application\/json/);

    expect(response.text).toContain('Incorrect password.');
  });

  test('users can update their info', async () => {
    const data = {
      userName: 'Just Dana',
      email: 'just@dana.com',
    };

    const response = await api
      .put('/api/users/update-info')
      .send(data)
      .expect(200)
      .set('authorization', authorization);

    expect(response.text).toContain('Just Dana');
  });

  test('users can change language settings', async () => {
    const data = {
      knownLanguageId: 'nl',
      learnLanguageId: 'de',
    };

    const response = await api
      .put('/api/users/set-languages')
      .send(data)
      .expect(200)
      .set('authorization', authorization);

    expect(response.text).toContain('nl');
  });

  describe('user confirmation', () => {
    test('confirmed', async () => {
      const data = {
        password: 'danapwhash',
      };

      await api
        .post('/api/users/confirm')
        .send(data)
        .expect(200)
        .set('authorization', authorization)
        .expect('{"match":"true"}');
    });

    test('not confirmed', async () => {
      const data = {
        password: 'wrong password',
      };

      await api
        .post('/api/users/confirm')
        .send(data)
        .expect(200)
        .set('authorization', authorization)
        .expect('{"match":"false"}');
    });
  });

  test('users are successfully deleted', async () => {
    await api
      .delete('/api/users/')
      .expect(204)
      .set('authorization', authorization);
  });
});

afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});
