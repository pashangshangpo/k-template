const {join} = require('path');
const {devPath, devHtmlPath, postcssPath} = require('./config');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true',
      './server/dev.client',
      './src/index.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
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
        }))
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[ext]',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  output: {
      filename: '[name].js',
      // 代码分割时的文件名
      chunkFilename: '[chunkhash].chunk.js',
      path: join(devPath, 'js'),
      publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [
    // 提取css
    new ExtractTextPlugin('css/index.css'),
    // 环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    // 提取公共代码,针对多入口有用
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    // 引用公共包
    new webpack.DllReferencePlugin({
        manifest: require(join(devPath, 'js/dll', 'vendor-manifest.json'))
    }),
    // 热加载
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};