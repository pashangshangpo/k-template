const http = require('http');
const fs = require('fs');
const {resolve, join} = require('path');
const {fileContentReplace, replace, appendCss, appendJs} = require('./util/util');
const {devHtmlPath, injectPath} = require('../config/config');
const Koa = require('koa2');
const app = new Koa();
const route = require('koa-route');
const webpackMiddleware = require('koa-webpack');
const mockServer = require('./common/mockServer');

let port = process.argv[2];
let apiPath = process.argv[3];
let webpackPath = process.argv[4];

webpackPath = `${resolve('.')}/${webpackPath}`;
apiPath = `${resolve('.')}/${apiPath}`;

const webpackConfig = require(webpackPath);
const entry = webpackConfig.entry;
const dev = require(injectPath).dev;

// 模板内容
let html = fs.readFileSync(devHtmlPath).toString();

// 向模板中注入代码
for (let key of Object.keys(dev)) {
  let section = dev[key];
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
	fs.writeFileSync(resolve('.', 'dev', `${key}.html`), curHtml = replace(html, {
		entryName: key,
		dateTime: Date.now()
	}));

	app.use(route.get(`/${key}.html`, cxt => {
	    cxt.body = curHtml;
	}));
}

app.use(route.get('/', cxt => {
	cxt.body = fs.readFileSync(resolve('.', 'dev/index.html')).toString();
}));

// 返回静态资源
app.use(route.get('/dev/js/lib/vendor.dll.js', cxt => {
    cxt.body = fs.readFileSync(resolve('.', 'dev/js/lib/vendor.dll.js')).toString();
}));

// 编译webpack
app.use(webpackMiddleware({
    config: webpackConfig,
    dev: {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }
}));

// 服务
let server = http.createServer(app.callback());

mockServer(app, server, apiPath);

server.listen(port, () => {
    console.log(`server => http://localhost:${port}`);
    console.log(`See request info => http://localhost:${port}/debug`);
});
