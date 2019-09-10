const express = require('express');
const morgan = require('morgan');
const logger = require('winston');
const bodyParser = require('body-parser');

const database = require('./database');
const api = require('./api/v1');

// Connect to database
database.connect();

// Initialize Express app
const app = express();

// Setup middleware
app.use(morgan('common'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Setup router and routes
app.use('/api', api);
app.use('/api/v1', api);

// Handle middleware errors
app.use((req, res, next) => {
  const message = 'Resource not found';
  logger.warn(message);
  res.status(404);
  res.json({
    error: true,
    message,
  });
});

app.use((err, req, res, next) => {
  let {
    statusCode = 500,
  } = err;
  const {
    message,
  } = err;

  // Validation Errors
  if (err.message.startsWith('ValidationError')) {
    statusCode = 422;
  }

  logger.error(`Error: ${message}`);
  res.status(statusCode);
  res.json({
    error: true,
    statusCode,
    message,
  });
});

module.exports = app;
