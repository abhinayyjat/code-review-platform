'use strict';
require('dotenv').config();

const { validateEnv, server } = require('./config/env');
validateEnv();

const http      = require('http');
const connectDB = require('./config/db');
const app       = require('./app');
const sockets   = require('./sockets');

async function start() {
  await connectDB();

  var httpServer = http.createServer(app);
  sockets.init(httpServer);  // initialize Socket.io with raw http server

  httpServer.listen(server.port, function() {
    console.log('[Server] Port ' + server.port + ' (' + server.nodeEnv + ')');
  });
}

start().catch(function(err) {
  console.error('[Server] Failed to start: ' + err.message);
  process.exit(1);
});
