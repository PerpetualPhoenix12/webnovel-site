const express = require('express');

const novels = require('./novels/novels.routes.js');
const users = require('./users/users.routes.js');
const auth = require('./auth/auth.routes.js');
const { isLoggedIn } = require('../middlewares.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API V1 BASE URL',
  });
});

router.use('/novels', isLoggedIn, novels);
router.use('/users', isLoggedIn, users);
router.use('/auth', auth);

module.exports = router;
