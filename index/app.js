/**
 * @file app.js
 * @date 2017-09-27 23:20
 * @author xiaozhihua
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const urlTo = require('url');
const querystring = require('querystring');

let port = process.argv[2];
let apiPath = process.argv[3];
let webpackPath = process.argv[4];
if (isNaN(port)) {
    webpackPath = apiPath;
    apiPath = port;
    port = 9870;
}
webpackPath = `${path.resolve('.')}/${webpackPath || 'webpack.dev.config.js'}`;
apiPath = apiPath || 'api.js';

const Koa = require('koa2');
const static = require('koa-static');
const multiparty = require('multiparty');
const prettyHtml = require('json-pretty-html').default;

const api = require(`${path.resolve('.')}/${apiPath}`);
const apiConfig = api.config;
const apiRequest = api.request;
const Mock = require('mockjs');

let socket = null;

let fsExistsSync = path => {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
};

// emitData
let emitData = () => {
    if (socket) {
        socket.emit('data', results.data);
    }
};

let toHtml = val => {
    let html = null;
    let text = null;

    if (typeof val === 'object') {
        if (JSON.stringify(val) === '{}') {
            text = null;
        }
        else {
            html = prettyHtml(val);
        }
    }
    else {
        try {
            html = prettyHtml(JSON.parse(val));
        }
        catch (err) {
            text = val;
        }
    }

    return {
        html,
        text
    };
};

// 收集信息
let results = {
    data: [],
    add: ({req, postData = null, formData = null, res} = data) => {
        let url = urlTo.parse(req.reqUrl);

        results.data.push({
            requestInfo: {
                url: url.href,
                urlParse: url,
                method: req.method
            },
            query: querystring.parse(url.query),
            postData: toHtml(postData),
            formData: toHtml(formData),
            resultData: toHtml(res)
        });
    },
    clear: () => {
        results.data.length = 0;
    }
};

// 打开跨域
let openCross = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if ('options' === req.method.toLowerCase()) {
        res.set({
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Headers': 'cache-control,content-type,hash-referer,x-requested-with',
            'Access-Control-Allow-Origin': '*'
        });
        res.body = ' ';
        return true;
    }
};

// 打开调式页面
let openTestView = (req, res) => {
    if ('/debug' === req.url || '/debug.html' === req.url) {
        res.set('Content-Type', 'text/html');
        res.body = fs.readFileSync(__dirname + '/view.html');
        return true;
    }
    else if ('/favicon.ico' === req.url) {
        res.body = ' ';
        return true;
    }
};

// 匹配路径
let regPath = (apiRequest, pathname) => {
    let regResult = null;
    let result = null;
    for (let k in apiRequest) {
        if (apiRequest.hasOwnProperty(k)) {
            if (regResult = pathname.match(new RegExp(k))) {
                result = {
                    name: k,
                    data: apiRequest[k],
                    regResult: regResult
                };
            }
        }
    }

    return result;
};

// 获取本地数据
let requestLocalData = regItem => {
    let data = '';
    let resData = results.data[results.data.length - 1];

    // 获取数据
    if (regItem && true !== regItem) {
        if ('file' === regItem.active) {
            data = fs.readFileSync(regItem.file).toString();
        }
        else {
            data = regItem[regItem.active || 'ok'] || regItem;
            data = typeof data === 'function'
                ? data.call(
                    Object.assign(
                        {},
                        resData,
                        {
                            Mock: Mock,
                            mock: Mock.mock,
                            Random: Mock.Random
                        }
                    ),
                    Mock, {postData: resData.postData, formData: resData.formData}
                )
                : data;
        }
    }
    else {
        data = regItem;
    }

    resData.resultData = toHtml(data);
    resData.resultData.test = true;
    return data;
};

// 获取请求响应数据
let getData = async re => {
    return new Promise(resolve => {
        if (re.headers['content-type'] && -1 !== re.headers['content-type'].indexOf('multipart/form-data')) {
            let form = new multiparty.Form();
            form.parse(re, (err, fields, files) => {
                resolve({
                    postData: null,
                    formData: {
                        fields,
                        files
                    }
                });
            });
        }
        else {
            let data = [];
            re.on('data', chunk => data.push(chunk));
            re.on('end', () => {
                resolve({
                    postData: Buffer.concat(data).toString(),
                    formData: {}
                });
            });
        }
    });
};

// 转发请求
let requestServer = (url, req) => {
    return new Promise(resolve => {
        let urlParse = urlTo.parse(url);
        let serverReq = http.request(
            {
                hostname: urlParse.hostname,
                port: urlParse.port,
                path: urlParse.path,
                method: req.method,
                headers: {
                    'Cookie': apiConfig.cookie || ''
                }
            },
            result => {
                getData(result).then(data => {
                    data = data.postData;

                    try {
                        data = JSON.parse(data.postData);
                    }
                    catch (err) {
                    }

                    resolve(data);
                });
            }
        );

        req.pipe(serverReq);
    });
};

const app = new Koa();

app.use(static(path.resolve('.')));

if (fsExistsSync(webpackPath)) {
    let webpackConfig = require(webpackPath);
    let webpackMiddleware = require('koa-webpack');
    app.use(webpackMiddleware({
        config: webpackConfig,
        dev: {
            publicPath: webpackConfig.output.publicPath,
            noInfo: true
        }
    }));
}

app.use(function *(next) {
    let req = this.req;
    let res = this.res;
    let koaReq = this.request;
    let koaRes = this.response;
    let reqUrl = `http://${koaReq.header.host}${koaReq.url}`;

    req.reqUrl = reqUrl;

    if (openCross(koaReq, koaRes) || openTestView(koaReq, koaRes)) {
        return false;
    }
    else if (-1 !== req.url.indexOf('socket.io')) {
    }
    else {
        let url = urlTo.parse(reqUrl);
        let regPathResult = null;
        let resultData = {
            req: req,
            postData: null,
            formData: null,
            res: null
        };

        // 获取请求数据
        yield getData(req).then(data => {
            resultData.postData = data.postData;
            resultData.formData = data.formData;
        }).then(async () => {
            let data = '';

            if ((regPathResult = regPath(apiRequest, url.pathname)) && false !== apiConfig.open) {
                results.add(resultData);
                data = requestLocalData(regPathResult.data);
            }
            else {
                // 处理url
                let serverUrl = '';
                if (apiConfig.testServer) {
                    if ('/' === apiConfig.testServer.slice(-1)) {
                        apiConfig.testServer = apiConfig.testServer.slice(0, -1);
                    }

                    serverUrl = [apiConfig.testServer, url.path].join('');
                }
                else {
                    serverUrl = reqUrl;
                }

                req.reqUrl = serverUrl;
                data = await requestServer(serverUrl, req).then(res => {
                    resultData.res = res;
                    results.add(resultData);

                    return res;
                });
            }

            // 延时返回
            await new Promise(resolve => {
                let delay = Math.random() * 2 * 800;
                if (apiConfig.delay) {
                    if ('function' === typeof apiConfig.delay) {
                        delay = apiConfig.delay();
                    }
                    else {
                        delay = apiConfig.delay;
                    }
                }

                setTimeout(
                    () => {
                        resolve();
                    },
                    delay
                );
            }).then(() => {
                koaRes.body = data;
                emitData();
            });
        });
    }
});

// 服务
let server = http.createServer(app.callback());

// 监听socket请求
const io = require('socket.io')(server);
io.on('connection', function (skt) {
    socket = skt;
    socket.on('clearData', () => {
        results.clear();
    });
});

server.listen(port, () => {
    console.log(`server => http://localhost:${port}`);
    console.log(`See request info => http://localhost:${port}/debug`);
});