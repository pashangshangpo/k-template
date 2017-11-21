const merge = require('webpack-merge');
const {userKConfigPath} = require('./config');

// 合并默认配置
module.exports = merge(
  {
    env: {
      dev: {
        publicPath: '/',
        outputPath: './dev',
        inject: {
          css: [
            'css/index.css?dateTime=@dateTime@'
          ],
          js: [
            'dll/vendor.dll.js?dateTime=@dateTime@',
            'common.js?dateTime=@dateTime@',
            '@entryName@.js?dateTime=@dateTime@'
          ]
        }
      },
      dest: {
        publicPath: '/',
        outputPath: './dist/dest',
        inject: {
          css: [
            '@indexCssPath@'
          ],
          js: [
            '@dllJsPath@',
            '@commonJsPath@',
            '@indexJsPath@'
          ]
        }
      }
    }
  },
  require(userKConfigPath)
);