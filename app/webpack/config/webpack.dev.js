const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: 'development',
  output: {},
};

module.exports = merge.smart(baseConfig, devConfig);
