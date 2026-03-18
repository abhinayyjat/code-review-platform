'use strict';
const mongoose = require('mongoose');
const crypto   = require('crypto');

const ROLES = ['owner', 'admin', 'member'];

const memberSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role:     { type: String, enum: ROLES, default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const pendingInviteSchema = new mongoose.Schema(
  {
    email:     { type: String, required: true, lowercase: true, trim: true },
    role:      { type: String, enum: ROLES, default: 'member' },
    tokenHash: { type: String, required: true },  // SHA-256 hash — raw token never stored
    expiresAt: { type: Date, required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Team name is required'],
      trim:      true,
      minlength: [2, 'Min 2 chars'],
      maxlength: [64, 'Max 64 chars'],
    },
    members:        [memberSchema],
    pendingInvites: [pendingInviteSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id; delete ret._id; delete ret.__v;
        // Never expose token hashes over the API
        if (ret.pendingInvites) {
          ret.pendingInvites = ret.pendingInvites.map(function(inv) {
            var safe = Object.assign({}, inv);
            delete safe.tokenHash;
            return safe;
          });
        }
        return ret;
      },
    },
  }
);

teamSchema.index({ 'members.userId': 1 });

// A team must always have at least one owner
teamSchema.pre('save', function(next) {
  var ownerCount = this.members.filter(function(m) { return m.role === 'owner'; }).length;
  if (ownerCount === 0) return next(new Error('Team must have at least one owner'));
  next();
});

// Generate secure invite token — store only the SHA-256 hash
teamSchema.methods.createInviteToken = function(email, role, invitedBy) {
  var rawToken  = crypto.randomBytes(32).toString('hex');
  var tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  var expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  this.pendingInvites.push({ email: email, role: role, tokenHash: tokenHash,
                             expiresAt: expiresAt, invitedBy: invitedBy });
  return rawToken;  // returned once, sent by email, never stored raw
};

// Verify and consume an invite token on acceptance
teamSchema.methods.consumeInviteToken = function(rawToken) {
  var hash = crypto.createHash('sha256').update(rawToken).digest('hex');
  var idx  = this.pendingInvites.findIndex(function(inv) {
    return inv.tokenHash === hash && inv.expiresAt > new Date();
  });
  if (idx === -1) return null;
  var invite = this.pendingInvites[idx];
  this.pendingInvites.splice(idx, 1);  // one-time use
  return invite;
};

module.exports = mongoose.model('Team', teamSchema);
module.exports.ROLES = ROLES;

