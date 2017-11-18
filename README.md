### 技术栈

- react
- react-router
- mobx
- postcss

### 快速搭建webpack环境

```
git clone
cd k-template
yarn run create 项目名
cd ../项目名
yarn run [dev, dest] [port|8087] [环境上下文]
```

### 环境上下文

如果想在开发环境下,向在页面中注入不同环境变量,如qa,rd环境, 指定的上下文会被传入到config/inject中的dev环境

```javascript
module.exports = {
  dev: {
    css: [
    ],
    js: [
      'dev/js/dll/vendor.dll.js',
      'js/@entryName@.bundle.js',
      function (context) {
        let fn = '';
        switch (context) {
          case 'dev':
            fn = function () {
              window.CONTEXT = 'dev';
            };
            break;
          case 'qa':
            fn = function () {
              window.CONTEXT = 'qa';
            };
            break;
          case 'dest':
            fn = function () {
              window.CONTEXT = 'dest';
            };
            break;
        }

        return fn;
      }
    ]
  },
  dest: {
    css: [
    ],
    js: [
      'js/dll/vendor.dll.js',
      'js/common.bundle.js',
      'js/@entryName@.bundle.js',
      function () {
        return function () {
          window.CONTEXT = 'dest';
        }
      }
    ]
  }
};
```

### 相关目录及文件说明

- /api 存放模拟后端的数据
- /config 相关配置文件
- /config/dest.html 生产环境模板
- /config/dev.html 开发环境模板
- /config/inject.js 此文件中配置的css,js脚本会被注入到页面中
- /config/postcss.config.js postcss配置
- /config/webpack.common.js webpack公共配置
- /config/webpack.dest.config.js webpack生产环境配置
- /config/webpack.dev.config.js webpack开发环境配置
- /server 相关服务配置,不需要动
- /src 写代码的地方

### 其他说明

在inject中添加的css,js文件会自动加上时间戳,如果你希望将模板[dev.html, dest.html]文件中css,js文件也加上时间戳,可以这样设置

```html
<script src="index.js?dateTime=@dateTime@"></script>
```
脚本会自动查找@dateTime@并替换成当前的时间戳
