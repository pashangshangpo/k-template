const webpack = require('webpack');
const merge = require('webpack-merge');
const {resolve, join} = require('path');
const {root, dllPath, kConfigPath, webpackDllCommonPath} = require('./config');
const kConfig = require(kConfigPath);
const library = '[name]_[hash]';

// --env.context=
module.exports = env => {
  // 上下文
  const context = env.context;
  const {outputPath} = kConfig.env[context];
  const devDllPath = join(root, outputPath, dllPath);

  return merge(require(webpackDllCommonPath), {
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
};
