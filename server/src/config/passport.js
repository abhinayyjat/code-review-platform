'use strict';
const passport       = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User           = require('../models/User');
const { github, jwt: jwtCfg } = require('./env');
const jwt            = require('jsonwebtoken');

passport.use(new GitHubStrategy(
  {
    clientID:     github.clientId,
    clientSecret: github.clientSecret,
    callbackURL:  github.callbackUrl,
    scope:        ['user:email', 'repo'],
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      var user = await User.findOneAndUpdate(
        { githubId: profile.id.toString() },
        {
         username:    profile.username,
          email:       profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
          avatarUrl:   profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          accessToken: accessToken,
        },
        { upsert: true, new: true, runValidators: true }
      );
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

module.exports = passport;
  
