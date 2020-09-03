function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
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
      res.status(400);
      throw new Error(error_msg);
    } else {
      return next();
    }
  } catch (error) {
    return next(error);
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

module.exports = {
  notFound,
  errorHandler,
  verifyNovelID,
  verifyChapterNumber,
  verifyUserID,
};
