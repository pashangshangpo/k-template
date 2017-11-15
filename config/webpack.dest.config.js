const {join} = require('path');
const {destPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
      filename: 'js/[name].bundle.js',
      chunkFilename: 'js/[chunkhash].chunk.js',
      path: destPath,
      publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('css/styles.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
    new webpack.DllReferencePlugin({
      manifest: require(join(destPath, 'js/dll', "vendor-manifest.json"))
    })
  ]
});
