'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type:     String,
      required: [true, 'githubId is required'],
      unique:   true,
      index:    true,
    },
    username: {
      type:      String,
      required:  [true, 'username is required'],
      trim:      true,
      maxlength: [64, 'username cannot exceed 64 characters'],
    },
    email: {
      type:      String,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    avatarUrl:   { type: String, trim: true },
    accessToken: {
      type:   String,
      select: false,  // NEVER returned unless .select('+accessToken') used explicitly
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.accessToken;  // second layer of protection
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
