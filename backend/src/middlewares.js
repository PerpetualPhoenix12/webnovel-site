/* eslint-disable no-multi-spaces */
const jwt = require('./lib/jwt.js');
const { errorMessages } = require('./constants/messages');

function notFound(req, res, next) {
  const err = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'no' : err.stack,
    errors: err.errors || undefined,
  });
}

function verifyNumber(res, next, error_msg, val) {
  try {
    if (Number.isNaN(+val)) {
      res.status(422);
      throw new Error(error_msg);
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
  const methods = {
    0: ['GET', 'POST'],               // /api/v1/novels/
    1: ['GET', 'PATCH', 'DELETE'],    // /api/v1/novels/:id
    2: ['GET', 'POST'],               // /api/v1/novels/:id/chapters
    3: ['GET', 'PATCH', 'DELETE'],    // /api/v1/novels/:id/chapters/:id
  };
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
