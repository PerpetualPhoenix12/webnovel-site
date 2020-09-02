const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares.js');

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// app.use(middlewares.hasAuth);

app.get('/', (req, res) => {
  res.status(418);
  res.json({
    message: 'Here\'s the teapot!',
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Add error handling

module.exports = app;
