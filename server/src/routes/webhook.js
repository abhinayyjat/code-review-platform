'use strict';
const router       = require('express').Router();
const webhookAuth  = require('../middleware/webhookAuth');
const githubService = require('../services/githubService');
const reviewService = require('../services/reviewService');
const User          = require('../models/User');

// Use raw body parser for signature verification
router.post('/github',
  require('express').raw({ type: 'application/json' }),
  webhookAuth,
  async function(req, res) {
    try {
      var payload = JSON.parse(req.body.toString());
      var event   = req.headers['x-github-event'];

      // Only handle push events
      if (event !== 'push') {
        return res.json({ message: 'Event ignored: ' + event });
      }

      // Skip if no commits
      if (!payload.commits || payload.commits.length === 0) {
        return res.json({ message: 'No commits in push' });
      }

      // Find the user who pushed
      var githubId = payload.sender.id.toString();
      var user     = await User.findOne({ githubId: githubId })
                              .select('+accessToken');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Respond immediately — process reviews asynchronously
      res.json({ message: 'Webhook received — processing reviews' });

      // Get changed files and run reviews
      var files = await githubService.getChangedFiles(payload, user.accessToken);

      for (var file of files) {
        var language = githubService.detectLanguage(file.filename);
        await reviewService.runReview(user._id, file.patch, language, null);
        console.log('[Webhook] Auto-reviewed: ' + file.filename);
      }

    } catch (err) {
      console.error('[Webhook] Error:', err.message);
    }
  }
);

module.exports = router;
