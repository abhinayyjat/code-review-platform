'use strict';
const { server } = require('../config/env');

// Must have exactly 4 params — Express identifies error handlers this way
module.exports = function(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[Error]', err.message);

  var status  = err.statusCode || err.status || 500;
  var message = err.message    || 'Internal server error';

  res.status(status).json({
    error: message,
    // Stack only in development — never expose in production
    ...(server.isDev && { stack: err.stack }),
  });
};
