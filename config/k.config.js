const merge = require('webpack-merge');
const {userKConfigPath} = require('./paths');

// 合并默认配置
module.exports = merge(
  {
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
  require(userKConfigPath),
  // 用户配置的inject会被放在前面
  {
    env: {
      dev: {
        inject: {
          css: [
            'css/index.css'
          ],
          js: [
            'dll/vendor.dll.js',
            'common.js',
            '@entryName@.js'
          ]
        }
      },
      dest: {
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
  }
);