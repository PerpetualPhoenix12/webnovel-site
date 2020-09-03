const express = require('express');
const yup = require('yup');
const bcrypt = require('bcrypt');
const User = require('../users/users.model.js');
const jwt = require('../../lib/jwt.js');
const { errorMessages } = require('../../constants/messages.js');

const router = express.Router();

const schema = yup.object().shape({
  username: yup
    .string('Username must be a string.')
    .trim()
    .min(2, 'Username must be a minimum of 2 characters.')
    .required('Username is required.'),
  email: yup
    .string('Email must be a string.')
    .trim()
    .email('Email must follow a valid email format.')
    .required('Email is required.'),
  password: yup
    .string('Password must be a string.')
    .min(8, 'Password must be a minimum of 8 characters.')
    .max(100, 'Password can be no longer than 100 characters.')
    .matches(/[^A-Za-z0-9]/, 'Password must contain a special character.')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter.')
    .matches(/[a-z]/, 'Password must contain a lowercase letter.')
    .matches(/[0-9]/, 'Password must contain a number.')
    .required('Password is required'),
});

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    await schema.validate({
      username: 'AUserName',
      email,
      password,
    }, {
      abortEarly: false,
    });

    const user = await User.query().where({ email }).first();
    if (!user) throw new Error(errorMessages.invalidLogin);

    const valid_password = await bcrypt.compare(password, user.password);
    if (!valid_password) throw new Error(errorMessages.invalidLogin);

    const payload = {
      id: user.id,
      username: user.username,
      email,
    };
    const token = await jwt.sign(payload);
    res.json({
      user,
      token,
    });
  } catch (err) {
    if (err.message === errorMessages.invalidLogin || err.errors) res.status(401);
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const createdUser = { email, username, password };
    await schema.validate(createdUser, {
      abortEarly: false,
    });

    const existingUser = await User.query().where({ email }).first();
    if (existingUser) {
      throw new Error(errorMessages.emailInUse);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const insertedUser = await User
      .query()
      .insert({
        username,
        email,
        password: hashedPassword,
      });

    delete insertedUser.password;
    const payload = {
      id: insertedUser.id,
      username,
      email,
    };
    const token = await jwt.sign(payload);

    res.json({
      user: insertedUser,
      token,
    });
  } catch (err) {
    if (err.errors) res.status(400);
    else if (err.message === errorMessages.emailInUse) res.status(403);
    next(err);
  }
});

module.exports = router;

/*
 TODO:
 * [X] Install dependencies
 * [X] Mount routes
 * [] Validate request body
 * [] Generate token
 * [] Verify token
 * [] isLoggedIn middleware
 * [] Rate limit endpoints
*/
