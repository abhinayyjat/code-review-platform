'use strict';
const router  = require('express').Router();
const asyncHandler    = require('../utils/asyncHandler');
const { verifyToken } = require('../middleware/auth');
const Review          = require('../models/Review');

// GET /api/users/stats — review statistics for current user
router.get('/stats', verifyToken, asyncHandler(async function(req, res) {
  var userId = req.user.id;

  // Reviews per day for the last 30 days
  var thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  var reviews = await Review.find({
    userId:    userId,
    status:    'done',
    createdAt: { $gte: thirtyDaysAgo },
  }).select('createdAt result language');

  // Group by day
  var byDay = {};
  reviews.forEach(function(r) {
    var day = r.createdAt.toISOString().split('T')[0];
    if (!byDay[day]) byDay[day] = { date: day, count: 0, totalScore: 0 };
    byDay[day].count++;
    if (r.result && r.result.score) byDay[day].totalScore += r.result.score;
  });

  var dailyData = Object.values(byDay).map(function(d) {
    return {
      date:  d.date,
      count: d.count,
      avgScore: d.count > 0 ? Math.round(d.totalScore / d.count) : 0,
    };
  }).sort(function(a, b) { return a.date.localeCompare(b.date); });

  // Language breakdown
  var langCount = {};
  reviews.forEach(function(r) {
    langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  var languageData = Object.entries(langCount).map(function(entry) {
    return { name: entry[0], value: entry[1] };
  });

  // Overall stats
  var scores = reviews.filter(function(r) { return r.result && r.result.score; })
                       .map(function(r) { return r.result.score; });
  var avgScore = scores.length > 0
    ? Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length)
    : 0;

  res.json({
    totalReviews: reviews.length,
    avgScore:     avgScore,
    dailyData:    dailyData,
    languageData: languageData,
  });
}));

module.exports = router;
