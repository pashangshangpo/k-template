### 简介

快速搭建webpack项目模板

可基于此模板搭建一个自己的脚手架工具

### 快速开始

```
git clone https://github.com/pashangshangpo/k-template.git

cd k-template
[yarn|npm] run new 项目名

cd ../项目名
[yarn|npm] start
```

### 快速入门

#### 安装

```html
git clone https://github.com/pashangshangpo/k-template.git
```

#### 创建项目

```html
cd k-template
[yarn|npm] run new 项目名
cd ../项目名
```

例子

```html
cd k-template
yarn run new react-demo
cd ../react-demo
```

#### 开发

```html
[yarn|npm] start
```

默认会启动一个8087端口的服务,并且自动打开浏览器

#### 生产

```html
[yarn|npm] build
```

默认会编译到dist/dest目录下

### 更多命令

#### 开发环境

```html
[yarn|npm] start options

options: 
    -e: [dev|qa|dest|...] 环境,默认dev
    -p: [port] 端口,默认8087
```

#### 生产环境

```html
[yarn|npm] build options

options: 
    -e: [dev|qa|dest|...] 环境,默认dest
    -s: 编译完成后,开启一个服务,方便看编译后的效果
    -d: debug,会生成eval-source-map,方便调试,建议只在调试bug的时候开启
    -p: [port] 端口,默认8087, 开启-s有效
```

#### 静态服务器

```html
[yarn|npm] server options

options:
    -e: [dev|qa|dest|...] 环境,默认dest
    -p: [port] 端口,默认8087, 开启-s有效
```

#### 检查JS代码规范

```html
[yarn|npm] lint
```

### 相关目录及文件说明

#### /api/api.js 模拟后端数据

```html
module.exports = {
  config: {
    open: true, // 是否拦截请求,如果开启则先尝试走本地,如果本地获取不到数据则走服务器
    delay: 0, // 延时返回
    cookie: '', // cookie
    server: 'http://www.xx.com' // 要转发到的服务器地址
  },
  request: {
    // 拦截/api/get的get请求
    'get /api/get': ctx => {
      return {
        status: 'ok',
        data: 'get'
      };
    },
    // 拦截/api/all的post请求
    'post /api/post': ctx => {
      return {
          status: 'ok',
          data: 'post',
          url: ctx.url
      };
    },
    // 拦截/api/json的所有类型请求
    '/api/json': {
      json: 1121
    },
    '/api/user/:id': cxt => {
       return {
        status: 'ok',
        user: cxt.params.id,
        query: cxt.query
      };
    },
    // 转发请求到http://www.baidu.com
    '/baidu': 'http://www.baidu.com'
  }
};

```

```html
ctx: koa-router返回的请求对象
```

koa-router: https://github.com/alexmingoia/koa-router

另外还提供了几个常用工具

```html
cxt.query = query解析后的对象
cxt.Mock = Mock;
cxt.mock = Mock.mock;
cxt.Random = Mock.Random;
```

Mock使用的是Mockjs: https://github.com/nuysoft/Mock/wiki/Getting-Started

#### /k.config.js 自定义配置

```html
module.exports = {
  // 入口 
  entry: {
    index: [
      './src/index.js'
    ]
  },
  
  // 需要平移的静态文件目录 在此配置的不区分环境
  move: ['src/font'],
  
  // 是否自动打开浏览器
  autoOpenBrowser: true,
  
  // 需要嵌入的脚本和样式, js支持src,function两种方式, css仅支持href 在此配置的不区分环境
  inject: {
    css: ['http://www.jquery.com/jquery.min.css'],
    js: ['http://www.jquery.com/jquery.min.js', function() {}]
  },
  
  // 根据环境来配置 注意开发环境不会走outputPath的配置,始终输出到`dev/环境`目录下, outputPath配置的是编译环境输出路径
  env: {
    dest: {
      publicPath: '/',
      outputPath: 'dist/dest'
    },
    dev: {
      publicPath: '/',
      outputPath: 'dist/dev',
      move: ['src/xxx'],
      inject: {
        js: [
          function () {
            window.CONTEXT = 'dev';
          }
        ]
      }
    },
    qa: {
      publicPath: '/',
      outputPath: 'dist/qa',
      inject: {
        js: [
          function () {
            window.CONTEXT = 'qa';
          }
        ]
      }
    }
    ... 可自行添加更多环境
  }
};

```

##### 如何根据环境来开发或生产?

###### 选择开发环境

```html
[yarn|npm] start -e [dev|dest|qa|...]
```

例子

```html
yarn start -e dev
```

执行以上命令会将dev的配置用做开发环境,如果没有加-e默认也是dev环境

###### 选择生产环境

```html
[yarn|npm] build -e [dev|dest|qa...]
```

例子

```html
yarn build -e dest
```

执行以上命令会将dest用做编译配置

#### /config/template.html html模板

可自行修改

#### /config/postcss.config.js postcss配置

可自行修改

#### /config/webpack.common.js webpack公共配置

可自行修改

#### /config/webpack.dest.config.js webpack生产环境配置

可自行修改

#### /config/webpack.dev.config.js webpack开发环境配置

可自行修改

#### /server 相关服务配置,不需要动

#### /src 写代码的地方

### 其他

此项目只是作为一个模板来使用, 并不对webpack配置进行封装或限制, 因此当默认配置不足以满足你的需求时,可自行修改相关配置
