const {resolve, join} = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: [
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true',
            './src/index.js'
        ]
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: resolve('.', 'dev'),
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
                                path: './config'
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
            'process.env': {
                'NODE_ENV': 'development'
            }
        }),
        new webpack.DllReferencePlugin({
            manifest: require(resolve('.', 'dev/js/lib', "vendor-manifest.json"))
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};