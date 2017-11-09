const http = require('http');
const fs = require('fs');
const {resolve, join} = require('path');
const util = require('./util/util');
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
const html = fs.readFileSync(resolve('.', 'config/dev.html')).toString();

// 替换模板
for (let key in entry) {
	let curHtml = '';
	fs.writeFileSync(resolve('.', 'dev', `${key}.html`), curHtml = util.replace(html, {
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