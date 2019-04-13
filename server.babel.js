//  enable runtime transpilation to use ES6/7 in node
require('core-js/stable');
require('regenerator-runtime/runtime');

const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let config;

try {
  config = JSON.parse(babelrc);
  if (Array.isArray(config.plugins)) {
    config.plugins.push('dynamic-import-node');
  }
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('@babel/register')(config);
