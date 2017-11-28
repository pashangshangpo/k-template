### 技术栈

- react
- react-router
- mobx
- postcss

### 创建一个项目

```
git clone
cd k-template
[yarn|npm] run new 项目名
cd ../项目名
[yarn|npm] run start [-p: 8087] [-e: dev]

-p: 端口
-e: 上下文环境, 读取k.config.js里面的配置
```

### 编译项目

```
[yarn|npm] run build [-e: dest] [-s: true|false]

-e: 上下文环境, 读取k.config.js里面的配置
-s: 开启server,方便low一眼
```

### 相关目录及文件说明

- /api mock数据
- /config 相关配置文件
- /config/template.html 模板
- /config/postcss.config.js postcss配置
- /config/webpack.common.js webpack公共配置
- /config/webpack.dest.config.js webpack生产环境配置
- /config/webpack.dev.config.js webpack开发环境配置
- /server 相关服务配置,不需要动
- /k.config.js 自定义配置
- /src 写代码的地方
