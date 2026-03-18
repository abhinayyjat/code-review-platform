'use strict';
const mongoose = require('mongoose');

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python',
  'java', 'cpp', 'go', 'rust', 'php', 'ruby', 'csharp',
];

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'userId is required'],
      index:    true,
    },
    code: {
      type:      String,
      required:  [true, 'code is required'],
      maxlength: [50000, 'Code cannot exceed 50,000 characters'],
    },
    language: {
      type:     String,
      required: [true, 'language is required'],
      enum: {
        values:  SUPPORTED_LANGUAGES,
        message: '{VALUE} is not a supported language',
      },
    },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    status: {
      type:    String,
      enum:    ['pending', 'processing', 'done', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id; delete ret._id; delete ret.__v; return ret;
      },
    },
  }
);

// Compound index: get reviews for user X sorted newest first
reviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
module.exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
