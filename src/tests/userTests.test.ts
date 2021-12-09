import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

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
