'use strict';
var _io = null;

function init(server) {
  var { Server } = require('socket.io');
  var { server: serverCfg } = require('../config/env');

  _io = new Server(server, {
    cors: {
      origin:      serverCfg.clientUrl,
      methods:     ['GET', 'POST'],
      credentials: true,
    },
  });

  _io.on('connection', function(socket) {
    console.log('[Socket] Client connected: ' + socket.id);

    socket.on('disconnect', function() {
      console.log('[Socket] Client disconnected: ' + socket.id);
    });
  });

  return _io;
}

function getIO() {
  if (!_io) throw new Error('Socket.io not initialized — call init() first');
  return _io;
}

module.exports = { init: init, getIO: getIO };
