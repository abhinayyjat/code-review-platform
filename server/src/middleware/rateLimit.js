'use strict';
const { Redis } = require('@upstash/redis');
const { redis }  = require('../config/env');

const redisClient = new Redis({
  url:   redis.url,
  token: redis.token,
});

// Limit: 10 reviews per user per hour
var REVIEW_LIMIT  = 10;
var WINDOW_SECS   = 60 * 60; // 1 hour in seconds

exports.reviewRateLimit = async function(req, res, next) {
  try {
    var userId = req.user.id;
    var key    = 'rate:review:' + userId;

    var current = await redisClient.incr(key);

    // Set expiry only on first request in the window
    if (current === 1) {
      await redisClient.expire(key, WINDOW_SECS);
    }

    if (current > REVIEW_LIMIT) {
      var ttl = await redisClient.ttl(key);
      return res.status(429).json({
        error:     'Review limit reached. Maximum ' + REVIEW_LIMIT + ' reviews per hour.',
        retryAfter: ttl,
      });
    }

    // Add remaining count to response headers
    res.setHeader('X-RateLimit-Limit',     REVIEW_LIMIT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, REVIEW_LIMIT - current));

    next();
  } catch (err) {
    // If Redis is down, fail open — don't block legitimate users
    console.error('[RateLimit] Redis error:', err.message);
    next();
  }
};
