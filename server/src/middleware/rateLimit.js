'use strict';
const { redis } = require('../config/env');

var redisClient = null;

// Only initialize if proper Upstash URL is provided
if (redis.url && redis.url.startsWith('https://') && redis.token) {
  const { Redis } = require('@upstash/redis');
  redisClient = new Redis({
    url:   redis.url,
    token: redis.token,
  });
}

var REVIEW_LIMIT = 10;
var WINDOW_SECS  = 60 * 60;

exports.reviewRateLimit = async function(req, res, next) {
  // If Redis not configured, skip rate limiting
  if (!redisClient) return next();

  try {
    var userId  = req.user.id;
    var key     = 'rate:review:' + userId;
    var current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW_SECS);
    }
    if (current > REVIEW_LIMIT) {
      var ttl = await redisClient.ttl(key);
      return res.status(429).json({
        error:      'Review limit reached. Maximum ' + REVIEW_LIMIT + ' reviews per hour.',
        retryAfter: ttl,
      });
    }
    res.setHeader('X-RateLimit-Limit',     REVIEW_LIMIT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, REVIEW_LIMIT - current));
    next();
  } catch (err) {
    console.error('[RateLimit] Redis error:', err.message);
    next();
  }
};

