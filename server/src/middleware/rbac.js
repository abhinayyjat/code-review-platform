'use strict';
const Team = require('../models/Team');

// Usage: router.delete('/:id', verifyToken, requireRole(['owner']), handler)
exports.requireRole = function(allowedRoles) {
  return async function(req, res, next) {
    try {
      var teamId = req.params.teamId || req.body.teamId;
      if (!teamId) return res.status(400).json({ error: 'teamId required' });

      var team = await Team.findById(teamId);
      if (!team) return res.status(404).json({ error: 'Team not found' });

      var member = team.members.find(function(m) {
        return m.userId.toString() === req.user.id;
      });

      if (!member) {
        return res.status(403).json({ error: 'You are not a member of this team' });
      }

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions. Required: ' + allowedRoles.join(' or '),
        });
      }

      req.team   = team;
      req.myRole = member.role;
      next();
    } catch (err) { next(err); }
  };
};
