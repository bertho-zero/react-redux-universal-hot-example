//  enable runtime transpilation to use ES6/7 in node
require('babel-polyfill');

var fs = require('fs');

var babelrc = fs.readFileSync('./.babelrc');
var config;

try {
  config = JSON.parse(babelrc);
  if (Array.isArray(config.plugins)) {
    config.plugins.push('dynamic-import-node');
  }
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-register')(config);
