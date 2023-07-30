const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const path = require('path');

module.exports = merge(
  commonConfiguration,
  {
    mode: 'development',
    devtool: 'source-map',
    devServer:
    {
      port: 8080,
      open: true,
      static: {
        directory: path.resolve(__dirname, '../dist'),
      },
      watchFiles: ['src/**/*'],
    },
  }
);