const {join} = require('path');
const {devPath} = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
let entry = common.entry;

// 自动添加webpack-hot-middleware
let hotConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true';
for (let key in entry) {
  let section = entry[key];
  if (Array.isArray(section)) {
    section.unshift(hotConfig);
  }
  else {
    entry[key] = [hotConfig, section];
  }
}

module.exports = merge(common, {
    output: {
        filename: 'js/[name].bundle.js',
        path: devPath,
        publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': "'production'"
        }
      }),
      new webpack.DllReferencePlugin({
          manifest: require(join(devPath, 'js/dll', "vendor-manifest.json"))
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
});
