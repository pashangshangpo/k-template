const http = require('http');
const fs = require('fs');
const path = require('path');
const Koa = require('koa2');
const app = new Koa();
const route = require('koa-route');
let webpackMiddleware = require('koa-webpack');
const mockServer = require('./common/mockServer');

let port = process.argv[2];
let apiPath = process.argv[3];
let webpackPath = process.argv[4];

webpackPath = `${path.resolve('.')}/${webpackPath}`;
apiPath = `${path.resolve('.')}/${apiPath}`;

app.use(route.get('/', cxt => {
    cxt.body = fs.readFileSync(path.join(path.resolve('.'), 'src', 'dev.html')).toString();
}));

// 编译webpack
let webpackConfig = require(webpackPath);
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