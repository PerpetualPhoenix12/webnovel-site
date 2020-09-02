const supertest = require('supertest');

const app = require('./app.js');

describe('GET /', () => {
  it('should respond with a message', (done) => {
    supertest(app)
      .get('/')
      .expect('Content-Type', /json/, done);
  });
  it('should respond with a 418', (done) => {
    supertest(app)
      .get('/')
      .expect(418, done);
  });
});
