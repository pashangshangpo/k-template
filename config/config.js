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
// devDllPath
const devDllPath = join(root, 'dev/js/dll');
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
  port,
  devServerPath,
  destServerPath,
  apiPath
};
