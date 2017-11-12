const {join} = require('path');
const {destPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
      filename: 'js/[name].bundle.js',
      path: destPath,
      publicPath: '/'
  },
  plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'production'"
      }),
      new webpack.DllReferencePlugin({
          manifest: require(join(destPath, 'js/dll', "vendor-manifest.json"))
      })
  ]
});
