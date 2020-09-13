const express = require('express');
const User = require('./users.model.js');
const { verifyUserID } = require('../../middlewares.js');
const { route } = require('../auth/auth.routes.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.query().whereNull('deleted_at');
  res.json(users.map((user) => {
    // eslint-disable-next-line no-param-reassign
    delete user.password;
    return user;
  }));
});

router.use('/:id', verifyUserID);

router.get('/:id', async (req, res, next) => {
  const user = await User
    .query()
    .findById(req.params.id)
    .whereNull('deleted_at')
    .select('id', 'username', 'email', 'avatar_url', 'created_at', 'updated_at');

  if (user) res.json(user);
  else next();
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User
      .query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .patch({
        deleted_at: new Date().toISOString(),
      })
      .first()
      .returning('*');
    if (user) res.json(user);
    else next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
