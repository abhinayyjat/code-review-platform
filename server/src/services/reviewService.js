'use strict';
const Groq   = require('groq-sdk');
const Review = require('../models/Review');
const { groq: groqCfg } = require('../config/env');
const { REVIEW_SYSTEM_PROMPT, buildUserMessage } = require('../utils/prompts');

const client = new Groq({ apiKey: groqCfg.apiKey });

exports.runReview = async function(userId, code, language) {
  var review = await Review.create({
    userId:   userId,
    code:     code,
    language: language,
    status:   'processing',
  });

  try {
    var response = await client.chat.completions.create({
      model:       'llama-3.3-70b-versatile',  // best free model on Groq
      temperature: 0.2,
      max_tokens:  1500,
      messages: [
        { role: 'system', content: REVIEW_SYSTEM_PROMPT },
        { role: 'user',   content: buildUserMessage(language, code) },
      ],
    });

    var rawText  = response.choices[0].message.content.trim();
    var jsonText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/, '')
      .trim();

    var result = JSON.parse(jsonText);

    review.result = result;
    review.status = 'done';
    await review.save();

    return review;

  } catch (err) {
    review.status = 'failed';
    await review.save();
    throw err;
  }
};

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