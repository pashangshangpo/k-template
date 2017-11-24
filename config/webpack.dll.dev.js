const webpack = require('webpack');
const merge = require('webpack-merge');
const {join} = require('path');
const {dllPath, webpackDllCommonPath} = require('./paths');
const library = '[name]_[hash]';

module.exports = outputPath => {
  const devDllPath = join(outputPath, dllPath);

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
