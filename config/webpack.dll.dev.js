const webpack = require('webpack');
const merge = require('webpack-merge');
const {join} = require('path');
const {dllPath, dllName, webpackDllCommonPath, manifestName} = require('./paths');
const library = '[name]_[hash]';

module.exports = outputPath => {
  const devDllPath = join(outputPath, dllPath);

  return merge(require(webpackDllCommonPath), {
    output: {
      filename: '[name].' + dllName,
      path: devDllPath,
      library
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'production'"
      }),
      new webpack.DllPlugin({
        path: join(devDllPath, '[name].' + manifestName),
        name: library
      })
    ]
  });
};
