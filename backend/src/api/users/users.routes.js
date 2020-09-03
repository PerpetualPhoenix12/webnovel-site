const express = require('express');
const User = require('./users.model.js');
const { verifyUserID } = require('../../middlewares.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.query();
  res.json(users.map((user) => {
    // eslint-disable-next-line no-param-reassign
    delete user.password;
    return user;
  }));
});

router.get('/:id', verifyUserID, async (req, res, next) => {
  const user = await User
    .query()
    .findById(req.params.id)
    .whereNull('deleted_at')
    .select('id', 'username', 'email', 'avatar_url', 'created_at', 'updated_at');

  if (user) return res.json(user);
  return next();
});

module.exports = router;
