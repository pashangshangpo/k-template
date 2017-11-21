const {join} = require('path');
const {root, destPath, destDllPath, dllPath, postcssPath, indexMapDestOut, indexMap, dllMap, kConfigPath} = require('./config');
const kConfig = require(kConfigPath);
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const common = require('./webpack.common.js');

// 上下文
const context = process.argv[2];
let {outputPath, publicPath} = kConfig.env[context];
// outputPath = join(root, outputPath);

const dllMapConfig = require(join(root, outputPath, dllMap));
const manifestChunkhash = dllMapConfig.vendor.js.substr(0, dllMapConfig.vendor.js.lastIndexOf('.dll.js'));

module.exports = merge(common, {
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
      path: join(root, outputPath),
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
      name: 'common'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
    new webpack.DllReferencePlugin({
      manifest: require(join(root, outputPath, dllPath, `${manifestChunkhash}.manifest.json`))
    }),
    new AssetsPlugin({filename: join(outputPath, indexMap), prettyPrint: true})
  ]
});
