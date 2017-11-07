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
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true',
            './src/index.js'
        ]
    },
    output: {
        filename: 'bundle.js',

        path: resolve(__dirname, 'dev'),

        publicPath: '/src'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};