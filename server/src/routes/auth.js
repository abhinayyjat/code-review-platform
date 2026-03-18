'use strict';
const router  = require('express').Router();
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { jwt: jwtCfg, server } = require('../config/env');

// Step 1: Redirect user to GitHub
router.get('/github', passport.authenticate('github', { session: false }));

// Step 2: GitHub calls back here after user authorizes
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    // Issue a short-lived access token
    var token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      jwtCfg.secret,
      { expiresIn: jwtCfg.accessExpiry }
    );
    // Redirect to frontend with token in URL — frontend stores it
    res.redirect(server.clientUrl + '/auth/callback?token=' + token);
  }
);

// Get current authenticated user
router.get('/me', verifyToken, async function(req, res, next) {
  try {
    var user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// Logout — client deletes token; this endpoint is informational
router.post('/logout', verifyToken, function(req, res) {
  res.json({ message: 'Logged out — delete your token on the client' });
});

module.exports = router;


 