'use strict';
const router  = require('express').Router();
const ctrl    = require('../controllers/reviewController');
const { verifyToken }     = require('../middleware/auth');
const { reviewRateLimit } = require('../middleware/rateLimit');

// Rate limiter applied ONLY to POST (creation) — not to GET (reading history)
router.post('/',   verifyToken, reviewRateLimit, ctrl.createReview);
router.get('/',    verifyToken, ctrl.getReviews);
router.get('/:id', verifyToken, ctrl.getReview);

module.exports = router;
