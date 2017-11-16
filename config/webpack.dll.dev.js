const webpack = require('webpack');
const merge = require('webpack-merge');
const {resolve, join} = require('path');
const {devDllPath, webpackDllCommonPath} = require('./config');
const library = '[name]_[hash]';

module.exports = merge(require(webpackDllCommonPath), {
  output: {
    filename: '[name].dll.js',
    path: devDllPath,
    library
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
    new webpack.DllPlugin({
      path: join(devDllPath, '[name]-manifest.json'),
      name: library
    })
  ]
});
