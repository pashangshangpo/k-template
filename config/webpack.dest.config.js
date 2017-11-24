const {join} = require('path');
const {dllPath, postcssPath, indexMap, dllMap, commonJsName, manifestName, resolveApp} = require('./paths');
const {joinStr} = require('../server/util/util');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = (outputPath, publicPath) => {
  return merge(common, {
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /(node_modules|bower_components)/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: postcssPath
                  }
                }
              }
            ]
          })
        }
      ]
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[chunkhash].chunk.js',
      path: resolveApp(outputPath),
      publicPath: publicPath
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
        name: commonJsName
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'production'"
      }),
      new AssetsPlugin({
        update: true,
        filename: join(outputPath, indexMap),
        prettyPrint: true
      })
    ]
  });
};
