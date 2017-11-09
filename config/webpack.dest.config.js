/**
 * @file webpack.dev.config.js
 * @date 2017-10-15 14:01
 * @author xiaozhihua
 */

const {resolve} = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: [
            './src/index.js'
        ]
    },
    output: {
        filename: 'bundle.js',

        path: resolve(__dirname, 'dev'),

        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'style-loader',
                    {loader: 'css-loader', options: {importLoaders: 1}}, 
                    'postcss-loader'
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
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.NamedModulesPlugin()
    ]
};