const {resolve, join} = require('path');
const {postcssPath} = require('./config');
const webpack = require('webpack');

module.exports = {
  entry: {
      index: [
          './src/index.js'
      ],
      test: [
          './src/test.js'
      ]
  },
  output: {
      filename: 'js/[name].bundle.js',
      path: resolve('.', 'dest'),
      publicPath: '/'
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
        use: [
          'style-loader',
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
  plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'production'"
      }),
      new webpack.DllReferencePlugin({
          manifest: require(resolve('.', 'dest/js/dll', "vendor-manifest.json"))
      })
  ]
};
