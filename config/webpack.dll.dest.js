const webpack = require('webpack');
const merge = require('webpack-merge');
const {resolve, join} = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const {destDllPath, webpackDllCommonPath, dllMapDestOut} = require('./config');
const library = '[name]_[chunkhash]';

module.exports = merge(require(webpackDllCommonPath), {
  output: {
    filename: '[chunkhash].dll.js',
    path: destDllPath,
    library
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.DllPlugin({
      path: join(destDllPath, '[chunkhash].manifest.json'),
      name: library
    }),
    new AssetsPlugin({
      update: true,
      filename: dllMapDestOut, 
      prettyPrint: true
    })
  ]
});
