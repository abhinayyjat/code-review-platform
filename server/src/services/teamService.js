'use strict';
const Team = require('../models/Team');

exports.createTeam = async function(name, ownerId) {
  var team = await Team.create({
    name:    name,
    members: [{ userId: ownerId, role: 'owner' }],
  });
  return team;
};

exports.getMyTeams = async function(userId) {
  return Team.find({ 'members.userId': userId })
    .populate('members.userId', 'username avatarUrl');
};

exports.getTeamById = async function(teamId, userId) {
  var team = await Team.findOne({
    _id: teamId,
    'members.userId': userId,
  }).populate('members.userId', 'username avatarUrl');

  if (!team) {
    var err = new Error('Team not found');
    err.statusCode = 404;
    throw err;
  }
  return team;
};

exports.inviteMember = async function(team, email, role, invitedBy) {
  // Check if already a member
  var User = require('../models/User');
  var existing = await User.findOne({ email: email });
  if (existing) {
    var isMember = team.members.some(function(m) {
      return m.userId.toString() === existing._id.toString();
    });
    if (isMember) throw Object.assign(new Error('User is already a member'), { statusCode: 400 });
  }

  var rawToken = team.createInviteToken(email, role, invitedBy);
  await team.save();
  return rawToken;
};

exports.acceptInvite = async function(teamId, rawToken, userId) {
  var team = await Team.findById(teamId);
  if (!team) throw Object.assign(new Error('Team not found'), { statusCode: 404 });

  var invite = team.consumeInviteToken(rawToken);
  if (!invite) throw Object.assign(new Error('Invalid or expired invite token'), { statusCode: 400 });

  team.members.push({ userId: userId, role: invite.role });
  await team.save();
  return team;
};
