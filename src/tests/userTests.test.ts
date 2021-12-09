import supertest from 'supertest';
import app from '../app';
// import userRouter from '../routes/users';
// import { User } from '../types';

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

// test('a valid note can be added', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const response = await api.get('/api/notes')

//   const contents = response.body.map(r => r.content)

//   expect(response.body).toHaveLength(initialNotes.length + 1)
//   expect(contents).toContain(
//     'async/await simplifies making async calls'
//   )
// })