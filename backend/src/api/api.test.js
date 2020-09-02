const supertest = require('supertest');
const app = require('../app.js');

describe('GET /api/v1', () => {
  it('should respond with a message', async (done) => {
    const response = await supertest(app)
      .get('/api/v1')
      .expect('Content-Type', /json/);

    expect(response.body.message).toBeDefined();
    done();
  });
});
