const {join} = require('path');
const {destPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const common = require('./webpack.common.js');
const dllMap = require(join(destPath, 'dll.map.json'));
const dllPath = dllMap.vendor.js.substr(0, dllMap.vendor.js.lastIndexOf('.dll.js'));

module.exports = merge(common, {
  output: {
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[chunkhash].chunk.js',
      path: destPath,
      publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('css/[name].[contenthash].css'),
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
      manifest: require(join(destPath, 'js/dll', `${dllPath}.manifest.json`))
    }),
    new AssetsPlugin({filename: './dest/index.map.json', prettyPrint: true})
  ]
});
