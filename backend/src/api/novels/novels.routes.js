const express = require('express');
const queries = require('./novels.queries.js');
const chapters = require('./chapters/chapters.routes.js');
const { verifyNovelID } = require('../../middlewares.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const novels = await queries.all();
  res.json(novels);
});

router.get('/:id', verifyNovelID, async (req, res, next) => {
  const novel = await queries.get(req.params.id);
  if (novel) return res.json(novel);
  return next();
});

router.use('/:id/chapters', verifyNovelID, (req, res, next) => {
  req.id = req.params.id;
  next();
}, chapters);

module.exports = router;
