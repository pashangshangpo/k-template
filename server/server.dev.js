module.exports = ({port, webpackConfig, inject} = config) => {
  const http = require('http');
  const fs = require('fs');
  const {resolve, join} = require('path');
  const Koa = require('koa2');
  const app = new Koa();
  const Router = require('koa-router');
  const router = new Router();
  const webpackMiddleware = require('koa-webpack');
  const webpack = require('webpack');
  const merge = require('webpack-merge');
  const chokidar = require('chokidar');
  const mockServer = require('./common/mockServer');

  const {fileContentReplace, replace, appendCss, appendJs, getIp} = require('./util/util');
  let {root, templatePath, dllPath} = require('../config/config');
  
  const entry = webpackConfig.entry;
  const outputPath = webpackConfig.output.path;
  const publicPath = webpackConfig.output.publicPath;
  
  // 编译webpack
  let compiler = webpack(webpackConfig);
  
  let middleware = webpackMiddleware({
    compiler: compiler,
    dev: {
      publicPath: publicPath,
      noInfo: true,
      hot: true
    }
  });
  
  let timer = null;
  chokidar.watch([templatePath]).on('all', (event, path) => {
    clearTimeout(timer);
  
    if (event === 'change') {
      // 延迟刷新
      timer = setTimeout(() => {
        reloadHTML();
        middleware.hot.publish({action: 'reload'});
      }, 10);
    }
  });
  
  let reloadHTML = () => {
    // 模板内容
    let html = fs.readFileSync(templatePath).toString();
  
    // 向模板中注入代码
    for (let key of Object.keys(inject)) {
      let section = inject[key];
      if (section.length > 0) {
        if (key === 'css') {
          html = appendCss(html, section);
        }
        else if (key === 'js') {
          html = appendJs(html, section);
        }
      }
    }
  
    // 替换模板
    for (let key in entry) {
      let curHtml = '';
      fs.writeFileSync(join(outputPath, `${key}.html`), curHtml = replace(html, {
        entryName: key,
        dateTime: Date.now()
      }));
  
      router.get(`/${key}`, cxt => {
        cxt.body = curHtml;
      });
    }
  };
  
  reloadHTML();
  
  // 返回静态资源
  router.get('/', cxt => {
    cxt.body = fs.readFileSync(join(outputPath, 'index.html')).toString();
  });
  
  router.get('/dll/vendor.dll.js', cxt => {
    cxt.body = fs.readFileSync(join(outputPath, dllPath,'vendor.dll.js')).toString();
  });
  
  app.use(router.routes());
  app.use(middleware);
  
  // 服务
  let server = http.createServer(app.callback());
  
  mockServer(app, server);
  
  server.listen(port, () => {
    let ip = getIp();
    console.log(`server => http://${ip}:${port}`);
    console.log(`See request info => http://${ip}:${port}/debug`);
  });  
};