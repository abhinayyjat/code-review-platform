'use strict';
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Review    = require('../models/Review');
const { gemini: geminiCfg } = require('../config/env');
const { REVIEW_SYSTEM_PROMPT, buildUserMessage } = require('../utils/prompts');
const sockets   = require('../sockets');

const genAI = new GoogleGenerativeAI(geminiCfg.apiKey);
const model  = genAI.getGenerativeModel({
  model:             'gemini-1.5-flash',
  systemInstruction: REVIEW_SYSTEM_PROMPT,
});

exports.runReview = async function(userId, code, language, socketId) {
  var review = await Review.create({
    userId:   userId,
    code:     code,
    language: language,
    status:   'processing',
  });

  try {
    var io      = sockets.getIO();
    var socket  = socketId ? io.sockets.sockets.get(socketId) : null;

    // Emit review started event
    if (socket) socket.emit('review:start', { reviewId: review._id });

    // Stream from Gemini
    var result  = await model.generateContentStream(
      buildUserMessage(language, code)
    );

    var fullText = '';
    for await (var chunk of result.stream) {
      var chunkText = chunk.text();
      fullText += chunkText;
      // Emit each chunk to the specific client
      if (socket) socket.emit('review:chunk', { chunk: chunkText });
    }

    // Parse the complete JSON response
    var jsonText = fullText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/, '')
      .trim();

    var parsed = JSON.parse(jsonText);

    review.result = parsed;
    review.status = 'done';
    await review.save();

    // Emit completion event with full result
    if (socket) socket.emit('review:done', { review: review });

    return review;

  } catch (err) {
    review.status = 'failed';
    await review.save();
    if (socketId) {
      try {
        sockets.getIO().to(socketId).emit('review:error', { message: err.message });
      } catch (_) {}
    }
    throw err;
  }
};

// getReviewsByUser and getReviewById stay exactly the same as before
exports.getReviewsByUser = async function(userId, limit, skip) {
  return Review.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(limit || 20)
    .skip(skip  || 0)
    .select('-code');
};

exports.getReviewById = async function(reviewId, userId) {
  var review = await Review.findOne({ _id: reviewId, userId: userId });
  if (!review) {
    var err = new Error('Review not found');
    err.statusCode = 404;
    throw err;
  }
  return review;
};
