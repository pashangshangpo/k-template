const urlTo = require('url');
const http = require('http');
const mime = require('mime');
const fse = require('fs-extra');
const querystring = require('querystring');
const {join} = require('path');
const multiparty = require('multiparty');
const Router = require('koa-router');
const router = new Router();
const prettyHtml = require('json-pretty-html').default;
const Mock = require('mockjs');
const {apiPath, resolveApp} = require('../../config/paths');
const {each, joinStr} = require('../util/util');

module.exports = (app, server, staticPath) => {
  const io = require('socket.io')(server);

  // 监听socket请求
  let socket = null;
  io.on('connection', function (skt) {
      socket = skt;
      socket.on('clearData', () => {
          results.clear();
      });
  });

  // emitData
  let emitData = () => {
      if (socket) {
        let data = results.data;
        data = data.map(item => {
          item.postData = toHtml(item.postData);
          item.formData = toHtml(item.formData);
          item.resultData = toHtml(item.resultData);

          return item;
        });
        socket.emit('data', data);
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
      add: ({req, reqBody, resBody} = data) => {
          results.data.push({
              method: req.method,
              url: req.url,
              query: querystring.parse(urlTo.parse(req.url).query),
              reqBody: reqBody,
              resBody: resBody
          });

          console.log(results.data);
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
                  resolve(Object.assign(
                    {},
                    fields,
                    files
                  ));
              });
          }
          else {
              let type = re.headers['content-type'];
              let isTo = !type || type.indexOf('json') !== -1 || type.indexOf('text') !== -1 || type.indexOf('xml') !== -1;
              let data = [];

              re.on('data', chunk => data.push(chunk));
              re.on('end', () => {
                  resolve(isTo ? Buffer.concat(data).toString() : Buffer.concat(data));
              });
          }
      });
  };

  // 转发请求
  let requestServer = (url, req) => {
      return new Promise(resolve => {
          let urlParse = urlTo.parse(url);
          let head = req.headers;
          let temp = {
              'Cookie': apiConfig.cookie || ''
          };

          if (head['content-length']) {
              temp['content-length'] = head['content-length'];
          }

          if (head['content-type']) {
              temp['content-type'] = head['content-type'];
          }

          let serverReq = http.request(
              {
                  hostname: urlParse.hostname,
                  port: urlParse.port,
                  path: urlParse.path,
                  method: req.method,
                  headers: temp
              },
              (result, req) => {
                  getData(result).then(data => {
                      try {
                          data = JSON.parse(data);
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

  // 打开调式页面
  router.get('/debug', cxt => {
    cxt.set('Content-Type', 'text/html');
    cxt.body = fs.readFileSync(resolveApp('server', 'debug.html'));
  });

  const api = require(apiPath);
  const apiConfig = api.config;
  const apiRequest = api.request;

  // 请求本地数据
  const requestLocal = api => {
    // 遍历request规则
    each(api, (val, key) => {
      // 提取method,url
      let arr = key.split(' ');
      let method = arr[0];
      let url = arr[1];
      if (!url) {
          url = method;
          method = 'all';
      }

      method = method.toLowerCase();

      if (typeof val === 'function') {
        router[method](url, async cxt => {
          // 暴露一些常用方法给用户
          cxt.query = querystring.parse(urlTo.parse(cxt.url).query);
          cxt.Mock = Mock;
          cxt.mock = Mock.mock;
          cxt.Random = Mock.Random;

          await getData(cxt.req).then(res => {
            cxt.reqBody = res;
          });

          // 等待用户配置的返回,防止用户在函数中使用了异步的操作
          await val(cxt);

          results.add({
            req: cxt.req,
            reqBody: cxt.reqBody,
            resBody: cxt.body
          });
        });
      }
      else if (typeof val === 'object') {
        router[method](url, async cxt => {
          await getData(cxt.req).then(res => {
            cxt.reqBody = res;
          });

          cxt.body = val;

          results.add({
            req: cxt.req,
            reqBody: cxt.reqBody,
            resBody: cxt.body
          });
        });
      }
      // 转发到服务器
      else if (typeof val === 'string') {
        router[method](url, async cxt => {
          getData(cxt.req).then(res => {
            cxt.reqBody = res;
          });

          await requestServer(val, cxt.req).then(res => {
            cxt.body = res;

            results.add({
              req: cxt.req,
              reqBody: cxt.reqBody,
              resBody: cxt.body
            });
          });
        });
      }
    });
  };

  // 如果开启拦截或未设置则请求本地数据
  if (apiConfig.open !== false) {
    requestLocal(apiRequest);
  }

  /**
   * 如果开启了拦截则先跑用户写的规则,
   * 如果规则不存在则尝试当成是获取本地文件,
   * 如果本地文件也不存在则到服务器中获取
   */
  router.all('*', async cxt => {
    let url = cxt.url;
    let path = '';
    if (url === '/' || url === '') {
      path = '/index.html';
    }
    else {
      path = url;
    }

    path = resolveApp(staticPath, path);

    if (!fse.existsSync(path)) {
      url = joinStr(apiConfig.server, url);

      getData(cxt.req).then(res => {
        cxt.reqBody = res;
      });

      await requestServer(url, cxt.req).then(res => {
        cxt.body = res;

        results.add({
          req: cxt.req,
          reqBody: cxt.reqBody,
          resBody: cxt.body
        });
      });
    }
    else {
      let type = 'text/plain';
      try {
        type = mime.lookup(path);
      }
      catch (err) {}

      // 低版本ie浏览器不认识application/javascript, 会当成文件来下载
      if (type === 'application/javascript') {
        type = 'text/plain';
      }

      cxt.set('Content-type', type);
      cxt.body = fse.readFileSync(path);
    }
  });

  app.use(router.routes());
};
