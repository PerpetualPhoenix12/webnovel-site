const express = require('express');
const novels = require('./novels/novels.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API V1 BASE URL',
  });
});
router.use('/novels', novels);

module.exports = router;
