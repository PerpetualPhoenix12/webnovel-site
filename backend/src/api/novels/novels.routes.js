const express = require('express');
const Novel = require('./novels.model.js');
const chapters = require('./chapters/chapters.routes.js');
const { verifyNovelID, verifyPayloadSize, verifyMethod } = require('../../middlewares.js');
const { errorMessages } = require('../../constants/messages.js');

const router = express.Router();

router.use('/', verifyMethod);

router.get('/', async (req, res) => {
  const novels = await Novel.query().whereNull('deleted_at');
  res.json(novels);
});

// TODO: [] Add request data validation
router.post('/', async (req, res, next) => {
  try {
    const novel = await Novel.query().insert(req.body);
    res.json(novel);
  } catch (err) {
    next(err);
  }
});

router.use('/:id', verifyMethod, verifyNovelID, verifyPayloadSize);

router.get('/:id', async (req, res, next) => {
  try {
    const novel = await Novel.query()
      .whereNull('deleted_at')
      .andWhere('id', req.params.id)
      .first();
    if (novel) res.json(novel);
    else next();
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const novel = await Novel.query().patchAndFetchById(
      req.params.id,
      req.body,
    );
    if (novel) res.json(novel);
    else throw new Error(errorMessages.invalidPayload);
  } catch (err) {
    next(err);
  }
});

router.use('/:id/chapters', (req, res, next) => {
  req.id = req.params.id;
  next();
}, chapters);

module.exports = router;

/*
* TODO
* [] Set up novel schema with objection
* [X] Add endpoint to create novel
* [X] Add endpoint to update novel
* [] Add endpoint to delete novel
*/
