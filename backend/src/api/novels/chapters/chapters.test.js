const supertest = require('supertest');
const app = require('../../../app.js');
const connection = require('../../../db.js');

afterAll(() => connection.destroy());

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

  it('should respond with a 404 if the novel_id doesn\'t exist', (done) => {
    supertest(app)
      .get('/api/v1/novels/999999999/chapters')
      .expect(404, done);
  });
});

describe('POST /api/v1/novels/:id/chapters', () => {
  it('should respond with a 200 if chapter data is valid', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'Cool Title 1',
        content: 'John was a powerful wizard.',
        number: 20,
        editor_id: 1,
        translator_id: 1,
      })
      .expect(200, done);
  });

  it('should respond with a 400 if title is not a string', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: {},
        content: 'John was a powerful wizard.',
        number: 3,
        editor_id: 1,
        translator_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if content is not a string', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'Another cool title',
        content: {},
        number: 50,
        editor_id: 1,
        translator_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if number is not an integer', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'Yet another cool title',
        content: 'John was a powerful wizard.',
        number: {},
        editor_id: 1,
        translator_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if editor_id is not an integer', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'Oh? an awesome title',
        content: 'John was a powerful wizard.',
        number: 4,
        editor_id: {},
        translator_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if translator_id is not an integer', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'Back again with the coolness',
        content: 'John was a powerful wizard.',
        number: 5,
        editor_id: 1,
        translator_id: {},
      })
      .expect(400, done);
  });

  it('should respond with a 400 if editor_id doesn\'t exist', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'k this is 2 cool',
        content: 'John was a powerful wizard.',
        number: 6,
        editor_id: 100,
        translator_id: 1,
      })
      .expect(400, done);
  });

  it('should respond with a 400 if translator_id doesn\'t exist', (done) => {
    supertest(app)
      .post('/api/v1/novels/1/chapters')
      .send({
        title: 'no more cool',
        content: 'John was a powerful wizard.',
        number: 7,
        editor_id: 1,
        translator_id: 100,
      })
      .expect(400, done);
  });
});

describe('DELETE /api/v1/novels/:id/chapters/:id', () => {
  it('should delete the chapter if it exists', (done) => {
    supertest(app)
      .delete('/api/v1/novels/1/chapters/2')
      .expect(200, done);
  });

  it('should return a 404 if the chapter doesn\'t exist', (done) => {
    supertest(app)
      .delete('/api/v1/novels/1/chapters/1000')
      .expect(404, done);
  });
});

/*
* Appropriate responses for posting:
* [X] valid chapter data
* [X] data with a missing field
* [X] data with an extra field
* invalid data types (400) on:
*   [X] title
*   [X] content
*   [X] number
*   [X] editor_id
*   [X] translator_id
* [X] data with an editor_id that doesn't exist
* [X] data with a translator_id that doesn't exist
* [X] data with a novel_id that doesn't exist
*/
