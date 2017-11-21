const {resolve, join} = require('path');

// 根路径
const root = resolve('.');
// 项目名
const project = root.split('/').pop();
// 配置路径
const configPath = join(root, 'config');
// 服务路径
const serverPath = join(root, 'server');
// api路径
const apiPath = join(root, 'api/api.js');

// 模板文件
const templatePath = join(configPath, 'template.html');

// postcssPath
const postcssPath = join(configPath, 'postcss.config.js');

// webpackDevPath
const webpackDevPath = join(configPath, 'webpack.dev.config.js');
// webpackDestPath
const webpackDestPath = join(configPath, 'webpack.dest.config.js');

// devServerPath
const devServerPath = join(serverPath, 'server.dev.js');
// destServerPath
const destServerPath = join(serverPath, 'server.dest.js');

// webpackDllCommonPath
const webpackDllCommonPath = join(configPath, 'webpack.dll.common.js');
// webpackDevDllPath
const webpackDevDllPath = join(configPath, 'webpack.dll.dev.js');
// webpackDestDllPath
const webpackDestDllPath = join(configPath, 'webpack.dll.dest.js');

// dllPath
const dllPath = '/js/dll';
// dllMap
const dllMap = 'dll.map.json';
// indexMap
const indexMap = 'index.map.json';


// tempPath
const tempPath = join(root, 'temp');
// fileTimePath
const fileTimePath = join(tempPath, 'filetime.json');

// k.config.js
const kConfigPath = join(configPath, 'k.config.js');
// 用户配置
const userKConfigPath = join(root, 'k.config.js');

// port
const port = 8087;

module.exports = {
  root,
  project,
  templatePath,
  postcssPath,
  webpackDevPath,
  webpackDestPath,
  webpackDevDllPath,
  webpackDestDllPath,
  webpackDllCommonPath,
  port,
  devServerPath,
  destServerPath,
  apiPath,
  indexMap,
  dllMap,
  dllPath,
  tempPath,
  fileTimePath,
  kConfigPath,
  userKConfigPath
};
