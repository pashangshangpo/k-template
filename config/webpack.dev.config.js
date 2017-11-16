const {join} = require('path');
const {devPath, devHtmlPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');
let entry = common.entry;

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
  output: {
      filename: '[name].js',
      chunkFilename: '[chunkhash].chunk.js',
      path: join(devPath, 'js'),
      publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin('css/index.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.DllReferencePlugin({
        manifest: require(join(devPath, 'js/dll', 'vendor-manifest.json'))
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
