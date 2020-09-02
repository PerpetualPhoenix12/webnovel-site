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

function hasAuth(req, res, next) {
  const auth = req.cookies.user;
  if (!auth) res.sendStatus(401);
  next();
}

module.exports = {
  notFound,
  errorHandler,
  hasAuth,
};
