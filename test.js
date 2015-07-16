var assert = require('assert');

var nes = require('./');
assert.equal(typeof nes, "function", "nes should be a function");

var controllers = nes();
assert(controllers.length > 0, "no controllers found");

// don't bolt if inside node-dev
if (!process.env._) process.exit(0);
