const webpack = require('webpack');
const merge = require('webpack-merge');
const {join} = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const {joinStr} = require('../server/util/util');
const {webpackDllCommonPath, dllPath, dllMap, dllName, manifestName, resolveApp} = require('./paths');
const library = '[name]_[chunkhash]';

module.exports = outputPath => {
  const destDllPath = resolveApp(outputPath, dllPath);

  return merge(require(webpackDllCommonPath), {
    output: {
      filename: joinStr('[name].[chunkhash].', dllName),
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
        path: join(destDllPath, joinStr('[name].[chunkhash].', manifestName)),
        name: library
      }),
      new AssetsPlugin({
        update: true,
        filename: join(outputPath, dllMap),
        prettyPrint: true
      })
    ]
  });
};
