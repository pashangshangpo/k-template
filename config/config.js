const {resolve, join} = require('path');

// 根路径
const root = resolve('.');
// 项目名
const project = root.split('/').pop();
// devhtml
const devHtmlPath = join(root, 'config/dev.html');
// desthtml
const destHtmlPath = join(root, 'config/dest.html');
// inject
const injectPath = join(root, 'config/inject.js');
// postcssPath
const postcssPath = join(root, 'config/postcss.config.js');
// webpackDevPath
const webpackDevPath = join(root, 'config/webpack.dev.config.js');
// webpackDestPath
const webpackDestPath = join(root, 'config/webpack.dest.config.js');
// devServerPath
const devServerPath = join(root, 'server/server.dev.js');
// destServerPath
const destServerPath = join(root, 'server/server.dest.js');
// webpackDevDllPath
const webpackDevDllPath = join(root, 'config/webpack.dll.dev.js');
// apiPath
const apiPath = join(root, 'api/api.js');

// devPath
const devPath = join(root, 'dev');
// destPath
const destPath = join(root, 'dest');
// dllPath
const dllPath = '/js/dll';
// devDllPath
const devDllPath = join(devPath, dllPath);
// destDllPath
const destDllPath = join(destPath, dllPath);

// indexMap
const indexMap = 'index.map.json';
// dllMap
const dllMap = 'dll.map.json';
// indexMap
const indexMapDest = join(destPath, indexMap);
// dllMapDest
const dllMapDest = join(destPath, dllMap);
// indexMapDestOut
const indexMapDestOut = join('./dest', indexMap);
// dllMapDestOut
const dllMapDestOut = join('./dest', dllMap);

// port
const port = 8087;

module.exports = {
  root,
  project,
  devHtmlPath,
  destHtmlPath,
  injectPath,
  postcssPath,
  webpackDevPath,
  webpackDestPath,
  webpackDevDllPath,
  devDllPath,
  destDllPath,
  port,
  devServerPath,
  destServerPath,
  apiPath,
  devPath,
  destPath,
  indexMapDest,
  dllMapDest,
  dllPath,
  indexMapDestOut,
  dllMapDestOut
};
