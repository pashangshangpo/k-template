const merge = require('webpack-merge');
const {userKConfigPath} = require('./paths');

// 合并默认配置
module.exports = merge(
  {
    autoOpenBrowser: true,
    env: {
      dev: {
        publicPath: '/',
        outputPath: 'dist/dev'
      },
      dest: {
        publicPath: '/',
        outputPath: 'dist/dest'
      }
    }
  },
  require(userKConfigPath)
);
