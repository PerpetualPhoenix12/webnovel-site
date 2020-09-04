const supertest = require('supertest');
const app = require('../../app.js');

describe('GET /api/v1/users', () => {
  it('should respond with an array of users', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/users')
      .expect('Content-Type', /json/);

    expect(response.body.length).toBeGreaterThan(0);
    done();
  });

  it('should respond with user with id 1', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/users/1')
      .expect('Content-Type', /json/);

    expect(response.body.id).toBe(1);
    done();
  });

  it('shouldn\'t return the user password', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/users/1')
      .expect('Content-Type', /json/);

    expect(response.body.password).toBeUndefined();
    done();
  });

  it('should respond with a 404 if user not found', (done) => {
    supertest(app)
      .get('/api/v1/users/9999')
      .expect(404, done);
  });

  it('should respond with a 404 if user is deleted', (done) => {
    supertest(app)
      .get('/api/v1/users/2')
      .expect(404, done);
  });

  it('should respond with a 422 if id is invalid', (done) => {
    supertest(app)
      .get('/api/v1/users/donkey')
      .expect(422, done);
  });
});
