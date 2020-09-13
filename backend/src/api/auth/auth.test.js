const supertest = require('supertest');
const app = require('../../app.js');
const connection = require('../../db.js');

afterAll(() => connection.destroy());

describe('POST /api/v1/auth/signup', () => {
  // it('should return a 200 if data is valid', (done) => {
  //   supertest(app)
  //     .post('/api/v1/auth/signup')
  //     .send({
  //       username: 'SuperDuper',
  //       password: 'SuperPassword123#',
  //       email: 'a@ab.com',
  //     })
  //     .expect(200, done);
  // });

  it('should return a 400 if password doesn\'t match regex', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        user: 'PerpPhoenix',
        password: 'notsosuperpassword',
        email: 'a@a.com',
      })
      .expect(400, done);
  });

  it('should return a 400 if password is too short', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        user: 'PerpPhoenix',
        password: 'abc',
        email: 'a@a.com',
      })
      .expect(400, done);
  });

  it('should return a 400 if password is too long', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'PerpPhoenix',
        password: 'a'.repeat(101),
        email: 'a@a.com',
      })
      .expect(400, done);
  });

  it('should return a 400 if password is not a string', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'PerpPhoenix',
        password: { my_pass: 'hereHERE1' },
        email: 'a@a.com',
      })
      .expect(400, done);
  });

  // it('should return a 4xx if a field is missing', (done) => {
  //   supertest(app)
  //     .post('/api/v1/auth/signup')
  //     .send({
  //       username: 'PerpPhoenix',
  //       email: 'a@a.com',
  //     })
  //     .expect(4xx, done);
  // });

  it('should return a 400 if the username is too short', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'x',
        password: 'SuperStrongPassword12',
        email: 'a@a.com',
      })
      .expect(400, done);
  });

  it('should return a 400 if the email is invalid', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'myusername',
        password: 'SuperStrongPassword12',
        email: 'toaster',
      })
      .expect(400, done);
  });

  it('should return a 403 if the email has already been used', (done) => {
    supertest(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'PerpetualPhoenix',
        password: 'SuperStrong123@Pass',
        email: 'coolestreader@gmail.com',
      })
      .expect(403, done);
  });
});

describe('POST /api/v1/auth/signin', () => {
  it('should return a 200 if login data is valid', async (done) => {
    supertest(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'coolestreader@gmail.com',
        password: 'MuffinsRG00D:',
      })
      .expect(200, done);
  });

  it('should return a 401 if email is invalid', (done) => {
    supertest(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'arandomemail@email.com',
        password: 'mypassword',
      })
      .expect(401, done);
  });

  it('should return a 401 if password is invalid', (done) => {
    supertest(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'coolestreader@gmail.com',
        password: 'mypassword',
      })
      .expect(401, done);
  });
});

/*
 * Status code breakdown:
 * 200 OK - Request was successful
 * 400 Bad Request - Used when the *sign up* data is syntactically invalid (e.g. missing field)
 * 401 Unauthorised - Used the the *sign in* data is invalid
 * 402 Payment Required - Used at *sign in* (£1/login attempt)
 * 403 Forbidden - Used at signup when the email already exists
 * 418 I'm a teapot - I'll find somewhere to add this
 */
