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
  });
}

function verifyNovelID(req, res, next) {
  const { id } = req.params;
  try {
    if (Number.isNaN(+id)) {
      res.status(400);
      throw new Error('Invalid novel ID');
    } else {
      return next();
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  notFound,
  errorHandler,
  verifyNovelID,
};
