const {postcssPath, kConfigPath} = require('./config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const util = require('../server/util/util');
const kConfig = require(kConfigPath);
let entry = kConfig.entry;

// 判断是否入口是否是字符串,如果是则自动生成index.html
if (typeof entry === 'string') {
  entry = {
    index: [entry]
  };
}

module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)/,
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
