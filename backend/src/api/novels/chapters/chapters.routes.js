const express = require('express');
const Chapter = require('./chapters.model.js');
const { verifyChapterNumber, verifyPayloadSize } = require('../../../middlewares.js');
const { errorMessages } = require('../../../constants/messages.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { id } = req;
  const chapters = await Chapter.query()
    .whereNull('deleted_at')
    .andWhere('novel_id', id)
    .orderBy('number', 'ASC');
  if (chapters.length > 0) return res.json(chapters);
  return next();
});

router.post('/', async (req, res, next) => {
  try {
    const chapter = req.body;
    chapter.novel_id = Number(req.id);
    const createdChapter = await Chapter.query().insert(chapter);
    res.json(createdChapter);
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const chapters = Chapter.query()
      .whereNull('deleted_at')
      .where('novel_id', req.id);
  } catch (err) {
    next(err);
  }
});

router.use('/:number', verifyChapterNumber, verifyPayloadSize);

router.get('/:number', async (req, res, next) => {
  try {
    const chapter = await Chapter.query()
      .whereNull('deleted_at')
      .andWhere('novel_id', req.id)
      .andWhere('number', req.params.number)
      .first();
    if (chapter) res.json(chapter);
    else next();
  } catch (err) {
    next(err);
  }
});

router.patch('/:number', async (req, res, next) => {
  try {
    const chapter = await Chapter.query()
      .whereNull('deleted_at')
      .andWhere('novel_id', req.id)
      .andWhere('number', req.params.number)
      .patch(req.body)
      .returning('*')
      .first();
    if (chapter) res.json(chapter);
    if (chapter === 0) throw new Error(errorMessages.invalidPayload);
    next();
  } catch (err) {
    next(err);
  }
});

router.delete('/:number', async (req, res, next) => {
  try {
    const deleted = await Chapter.query()
      .whereNull('deleted_at')
      .andWhere('novel_id', req.id)
      .andWhere('number', req.params.number)
      .patch({
        deleted_at: new Date().toISOString(),
      })
      .first()
      .returning('*');
    if (deleted) res.json(deleted);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
