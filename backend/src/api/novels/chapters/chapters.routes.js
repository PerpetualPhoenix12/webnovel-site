const express = require('express');
const queries = require('./chapters.queries.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { id } = req;
  const chapters = await queries.all(id);
  if (chapters.length > 0) return res.json(chapters);
  return next();
});

router.get('/:number', async (req, res, next) => {
  const { id } = req;
  const { number } = req.params;
  try {
    if (Number.isNaN(+number)) {
      res.status(400);
      throw new Error('Invalid chapter number');
    } else {
      const chapter = await queries.get(id, number);
      if (chapter) return res.json(chapter);
      return next();
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
