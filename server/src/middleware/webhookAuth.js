'use strict';
const crypto = require('crypto');
const { webhook } = require('../config/env');

module.exports = function webhookAuth(req, res, next) {
  var signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  if (!webhook.secret) {
    console.warn('[Webhook] WEBHOOK_SECRET not set — skipping verification');
    return next();
  }

  var hmac     = crypto.createHmac('sha256', webhook.secret);
  var digest   = 'sha256=' + hmac.update(req.body).digest('hex');

  // Use timingSafeEqual to prevent timing attacks
  var trusted  = Buffer.from(digest);
  var received = Buffer.from(signature);

  if (trusted.length !== received.length ||
      !crypto.timingSafeEqual(trusted, received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
};
