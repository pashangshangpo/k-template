const {postcssPath, kConfigPath, resolveApp} = require('./paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const util = require('../server/util/util');
const kConfig = require(kConfigPath);

module.exports = {
  entry: kConfig.entry,
  resolve: {
    cacheWithContext: true,
    extensions: ['.js', '.css'],
    modules: [resolveApp('src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: [resolveApp('src')],
        use: ['babel-loader?cacheDirectory']
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        exclude: /(node_modules|bower_components)/,
        include: [resolveApp('src')],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash].[ext]',
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};

