const webpack = require('webpack');
const merge = require('webpack-merge');
const {join} = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const {root, webpackDllCommonPath, dllMapDestOut, kConfigPath, dllPath, dllMap} = require('./config');
const kConfig = require(kConfigPath);
const library = '[name]_[chunkhash]';

module.exports = env => {
  // 上下文
  const context = env.context;
  const {outputPath} = kConfig.env[context];
  const destDllPath = join(root, outputPath, dllPath);

  return merge(require(webpackDllCommonPath), {
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
        filename: join(outputPath, dllMap),
        prettyPrint: true
      })
    ]
  });
};
