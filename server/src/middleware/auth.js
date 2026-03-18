'use strict';
const jwt        = require('jsonwebtoken');
const { jwt: jwtCfg } = require('../config/env');

// Protect any route by adding verifyToken as middleware
exports.verifyToken = function(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token      = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    var decoded = jwt.verify(token, jwtCfg.secret);
    req.user    = decoded; // { id, username, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};
