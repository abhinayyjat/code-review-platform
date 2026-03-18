"use strict";

const REQUIRED = [
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_CALLBACK_URL",
];

function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("[ENV] Missing variables:\n   " + missing.join("\n   "));
    process.exit(1);
  }
}

module.exports = {
  validateEnv,
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: (process.env.NODE_ENV || "development") === "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  },
  db: { uri: process.env.MONGODB_URI },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: "15m",
    refreshExpiry: "7d",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
  // Update the redis section in env.js:
  redis: {
  url:   process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
},


// Add to module.exports:
  groq: { apiKey: process.env.GROQ_API_KEY }, 
  redis: { url: process.env.REDIS_URL || "redis://localhost:6379" },
  email: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  webhook: { secret: process.env.WEBHOOK_SECRET },

};
