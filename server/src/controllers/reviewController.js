exports.createReview = asyncHandler(async function(req, res) {
  var code     = req.body.code;
  var language = req.body.language;
  var socketId = req.body.socketId;  // ← add this line

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'code is required' });
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Unsupported language: ' + language });
  }
  if (code.length > 50000) {
    return res.status(400).json({ error: 'Code exceeds 50,000 character limit' });
  }

  var review = await reviewService.runReview(req.user.id, code, language, socketId); // ← add socketId
  res.status(201).json(review);
});