const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // Development mode
  mode: 'development',

  // Enable source maps.
  devtool: 'inline-source-map',
});
