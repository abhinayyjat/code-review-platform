// server/test-review.js
require('dotenv').config();
const { validateEnv } = require('./src/config/env');
validateEnv();
const connectDB     = require('./src/config/db');
const reviewService = require('./src/services/reviewService');

async function test() {
  await connectDB();
  var result = await reviewService.runReview(
    '000000000000000000000001',
    'function add(a,b) { return a+b }',
    'javascript'
  );
  console.log(JSON.stringify(result.result, null, 2));
  process.exit(0);
}

test().catch(function(e) { console.error(e); process.exit(1); });