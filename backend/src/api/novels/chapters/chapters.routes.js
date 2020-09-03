const express = require('express');
const queries = require('./chapters.queries.js');
const { verifyChapterNumber } = require('../../../middlewares.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { id } = req;
  const chapters = await queries.all(id);
  if (chapters.length > 0) return res.json(chapters);
  return next();
});

router.get('/:number', verifyChapterNumber, async (req, res, next) => {
  const { id } = req;
  const { number } = req.params;
  const chapter = await queries.get(id, number);
  if (chapter) return res.json(chapter);
  return next();
});

module.exports = router;

/*
* TODO
* [] Set up chapter schema with objection
* [] Add endpoint to create chapter
* [] Add endpoint to update chapter
* [] Add endpoint to delete chapter
*/
