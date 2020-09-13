/* eslint-disable no-multi-spaces */
const {
  ValidationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  NotFoundError,
} = require('objection');
const jwt = require('./lib/jwt.js');
const { errorMessages } = require('./constants/messages');
const methods = require('./constants/methods.js');

function notFound(req, res, next) {
  const err = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
}

function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        res.status(400).send({
          status: err.statusCode,
          message: err.message,
          type: 'ModelValidationError',
        });
        break;
      default:
        res.status(400).send({
          message: err.message,
          type: 'UnknownValidationError',
        });
        break;
    }
  } else if (err instanceof UniqueViolationError) {
    res.status(409).send({
      message: err.message,
      type: 'UniqueViolation',
    });
  } else if (err instanceof NotNullViolationError) {
    res.status(400).send({
      mesesage: err.message,
      type: 'NotNullViolation',
    });
  } else if (err instanceof ForeignKeyViolationError) {
    res.status(400).send({
      message: err.message,
      type: 'ForeignKeyViolation',
    });
  } else if (err instanceof NotFoundError) {
    res.status(404).send({
      message: err.message,
      type: 'NotFound',
    });
  } else {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      status: statusCode,
      message: err.message,
      errors: err.errors || undefined,
    });
  }
}

function verifyNumber(res, next, err_msg, val) {
  try {
    if (Number.isNaN(+val)) {
      res.status(422);
      throw new Error(err_msg);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

function verifyNovelID(req, res, next) {
  return verifyNumber(res, next, 'Invalid novel ID', req.params.id);
}

function verifyChapterNumber(req, res, next) {
  return verifyNumber(res, next, 'Invalid chapter number', req.params.number);
}

function verifyUserID(req, res, next) {
  return verifyNumber(res, next, 'Invalid user ID', req.params.id);
}

function verifyPayloadSize(req, res, next) {
  if (req.params.id > 2 ** 31 || req.params.number > 2 ** 31) {
    res.status(404);
    next(new Error(`Not found - ${req.originalUrl}`));
  } else next();
}

function verifyMethod(req, res, next) {
  const split_path = req.path.split('/').filter((v) => v !== '');
  const allowed_methods = methods[split_path.length];
  if (allowed_methods.includes(req.method)) next();
  else {
    const err = new Error('Method Not Allowed');
    res.set('Allow', allowed_methods.join(', '));
    res.status(405);
    next(err);
  }
}

async function isLoggedIn(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) throw new Error(errorMessages.invalidAuth);
    const token = header.split(' ')[1];
    const decoded = await jwt.verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.message === errorMessages.invalidAuth) res.status(401);
    else if (err.message === errorMessages.invalidToken) {
      res.status(401);
      err.message = errorMessages.invalidAuth;
    }
    next(err);
  }
}

module.exports = {
  notFound,
  errorHandler,
  verifyNovelID,
  verifyChapterNumber,
  verifyUserID,
  verifyPayloadSize,
  verifyMethod,
  isLoggedIn,
};
