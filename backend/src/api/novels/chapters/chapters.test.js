const supertest = require('supertest');
const app = require('../../../app.js');

describe('GET /api/v1/novels/:id/chapters', () => {
  it('should respond with an array of chapters', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/novels/1/chapters')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    done();
  });

  it('should respond with a single chapter', async (done) => {
    const response = await supertest(app)
      .get('/api/v1/novels/1/chapters/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.novel_id).toBe(1);
    expect(response.body.number).toBe(1);
    done();
  });

  it('should respond with a 404 if chapter not found', (done) => {
    supertest(app)
      .get('/api/v1/novels/1/chapters/1000')
      .expect(404, done);
  });

  it('should respond with a 422 if number is invalid', (done) => {
    supertest(app)
      .get('/api/v1/novels/1/chapters/donkey')
      .expect(422, done);
  });
});
