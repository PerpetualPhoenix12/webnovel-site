const supertest = require('supertest');
const app = require('../../app.js');
const connection = require('../../db.js');

afterAll(() => connection.destroy());

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

describe('POST /api/v1/novels', () => {
  it('should respond with a 200 if the novel data is valid', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'New Novel 1',
        author_id: 1,
        synopsis: 'A super cool new novel',
      })
      .expect(200, done);
  });

  it('should respond with a 400 if the title is not a string', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: {},
        author_id: 1,
        synopsis: 'A super cool new novel',
      })
      .expect(400, done);
  });

  it('should respond with a 400 if the author_id is not an integer', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'New Novel 2',
        author_id: {},
        synopsis: 'A super cool new novel',
      })
      .expect(400, done);
  });

  it('should respond with a 400 if the synopsis is not a string', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'New novel 3',
        author_id: 1,
        synopsis: {},
      })
      .expect(400, done);
  });

  it('should respond with a 400 if the author_id doesn\'t exist', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'New novel 3',
        author_id: 999999,
        synopsis: 'Super epic synopsis',
      })
      .expect(400, done);
  });

  it('should respond with a 400 if a field is missing', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'New novel 999',
        author_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if there are extra fields', (done) => {
    supertest(app)
      .post('/api/v1/novels')
      .send({
        title: 'Newest novel',
        author_id: 1,
        synopsis: 'Tokyo, 2020. Very cool.',
        reviews: 100,
      })
      .expect(400, done);
  });
});

describe('DELETE /api/v1/novels/:id', () => {
  it('should delete the novel if it exists', (done) => {
    supertest(app)
      .delete('/api/v1/novels/1')
      .expect(200, done);
  });

  it('should return a 404 if the novel doesn\'t exist', (done) => {
    supertest(app)
      .delete('/api/v1/novels/1000')
      .expect(404, done);
  });
});

/*
* Appropriate responses for posting:
* [X] valid novel data
* [X] data with a missing field
* [X] data with an extra field
* invalid data types (400) on:
*   [X] title
*   [X] author_id
*   [X] synopsis
* [X] data with an author_id that doesn't exist
*/
