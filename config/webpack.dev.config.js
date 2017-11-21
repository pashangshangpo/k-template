const {join} = require('path');
let {root, devPath, devHtmlPath, postcssPath, kConfigPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const kConfig = require(kConfigPath);
const common = require('./webpack.common.js');
let entry = common.entry;

// 上下文
const context = process.argv[3];
let {outputPath, publicPath} = kConfig.env[context]

// 自动添加webpack-hot-middleware
let hotConfig = [
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true',
  './server/dev.client'
];

for (let key in entry) {
  let section = entry[key];
  if (Array.isArray(section)) {
    section.unshift.apply(section, hotConfig);
  }
  else {
    entry[key] = hotConfig.concat([section]);
  }
}

module.exports = merge(common, {
  module: {
    rules: [
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
      }
    ]
  },
  output: {
      filename: '[name].js',
      // 代码分割时的
      chunkFilename: '[chunkhash].chunk.js',
      path: join(root, outputPath),
      publicPath: publicPath
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
        manifest: require(join(root, outputPath, 'js/dll', 'vendor-manifest.json'))
    }),
    // 热加载
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
