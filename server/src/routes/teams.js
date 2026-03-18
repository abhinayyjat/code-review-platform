'use strict';
const router      = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const teamService     = require('../services/teamService');

// Create team
router.post('/', verifyToken, asyncHandler(async function(req, res) {
  var team = await teamService.createTeam(req.body.name, req.user.id);
  res.status(201).json(team);
}));

// Get my teams
router.get('/', verifyToken, asyncHandler(async function(req, res) {
  var teams = await teamService.getMyTeams(req.user.id);
  res.json(teams);
}));

// Get single team
router.get('/:teamId', verifyToken, asyncHandler(async function(req, res) {
  var team = await teamService.getTeamById(req.params.teamId, req.user.id);
  res.json(team);
}));

// Invite member (admin or owner only)
router.post('/:teamId/invite',
  verifyToken,
  requireRole(['owner', 'admin']),
  asyncHandler(async function(req, res) {
    var { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    var rawToken = await teamService.inviteMember(
      req.team, email, role || 'member', req.user.id
    );
    // In production send email — for now return token for testing
    res.json({ message: 'Invite created', inviteToken: rawToken });
  })
);

// Accept invite
router.post('/accept-invite', verifyToken, asyncHandler(async function(req, res) {
  var { teamId, token } = req.body;
  var team = await teamService.acceptInvite(teamId, token, req.user.id);
  res.json(team);
}));

module.exports = router;
