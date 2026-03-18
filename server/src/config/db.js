"use strict";
const mongoose = require("mongoose");
const { db } = require("./env");

mongoose.set("strictQuery", true);

//stripping credentials from uri before printing to logs
function safeUri(uri) {
  try {
    const u = new URL(uri);
    return u.protocol + "//" + u.host + u.pathname;
  } catch (_) {
    return "[invalid URI]";}
  }
  async function connectDB() {
    try {
      const conn = await mongoose.connect(db.uri, {
        maxPoolSize: 10, //max concurrent connections
        serverSelectionTimeoutMS: 5000, //fail in 5s if Atlas unreachable
        socketTimeoutMS: 45000, //Drop idle sockets after 45s
      });
      console.log(
        "[DB] Connected -> " +
          safeUri(db.uri) +
          " (" +
          conn.connection.name +
          ")",
      );
    } catch (err) {
      console.error("[DB] Initial connection failed: " + err.message);
      process.exit(1);
    }
  }

  mongoose.connection.on("disconnected", function () {
    console.warn("[DB] Disconnected — Mongoose will attempt to reconnect");
  });
  mongoose.connection.on("reconnected", function () {
    console.log("[DB] Reconnected");
  });
  mongoose.connection.on("error", function (err) {
    console.error("[DB] Error: " + err.message);
  });

  function gracefulShutdown(signal) {
    return async function () {
      console.log("[DB] " + signal + " received - closing connection");
      process.exit(0);
    };
  }
  process.on('SIGINT',  gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

module.exports = connectDB;

