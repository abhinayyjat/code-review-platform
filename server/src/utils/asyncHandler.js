'use strict';

// Eliminates try/catch boilerplate in every async controller
// Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
module.exports = function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
// test
