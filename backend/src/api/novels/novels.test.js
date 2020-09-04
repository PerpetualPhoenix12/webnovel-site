const supertest = require('supertest');
const app = require('../../app.js');

describe('GET /api/v1/novels', () => {
  it('should respond with an array of novels', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/novels')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    done();
  });

  it('should respond with a single novel', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/novels/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.id).toBe(1);
    done();
  });

  it('should respond with a 404 if novel not found', (done) => {
    supertest(app)
      .get('/api/v1/novels/100')
      .expect(404, done);
  });

  it('should respond with a 422 if id is invalid', (done) => {
    supertest(app)
      .get('/api/v1/novels/donkey')
      .expect(422, done);
  });
});
