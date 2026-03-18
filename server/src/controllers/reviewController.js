'use strict';
const reviewService  = require('../services/reviewService');
const asyncHandler   = require('../utils/asyncHandler');
const { SUPPORTED_LANGUAGES } = require('../models/Review');

exports.createReview = asyncHandler(async function(req, res) {
  var code     = req.body.code;
  var language = req.body.language;
  var socketId = req.body.socketId;  // client sends its socket ID

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'code is required' });
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Unsupported language: ' + language });
  }
  if (code.length > 50000) {
    return res.status(400).json({ error: 'Code exceeds 50,000 character limit' });
  }

  var review = await reviewService.runReview(req.user.id, code, language, socketId);
  res.status(201).json(review);
});

exports.getReviews = asyncHandler(async function(req, res) {
  var limit   = Math.min(parseInt(req.query.limit, 10) || 20, 50);
  var skip    = Math.max(parseInt(req.query.skip,  10) || 0,  0);
  var reviews = await reviewService.getReviewsByUser(req.user.id, limit, skip);
  res.json(reviews);
});

exports.getReview = asyncHandler(async function(req, res) {
  var review = await reviewService.getReviewById(req.params.id, req.user.id);
  res.json(review);
});
