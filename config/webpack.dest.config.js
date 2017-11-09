const {resolve, join} = require('path');
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
        new webpack.DllReferencePlugin({
            manifest: require(resolve('.', 'dest/js/lib', "vendor-manifest.json"))
        })
    ]
};