const {join} = require('path');
const program = require('commander');
const webpack = require('webpack');
const merge = require('webpack-merge');
const fse = require('fs-extra');
const spawn = require('cross-spawn');
const portIsOccupied = require('./util/portUtil');
const {joinStr, removeFile} = require('./util/util');
const defaultPort = 8087;

let {
  resolveApp,
  webpackDevPath,
  webpackDestPath,
  webpackDevDllPath,
  webpackDestDllPath,
  devServerPath,
  destServerPath,
  tempPath,
  fileTimePath,
  kConfigPath
} = require('../config/paths');

const kConfig = require(kConfigPath);

// 配置
const config = {
  envDefault: {
    test: 'dest',
    server: 'dev',
    build: 'dest'
  },
  getEnVConfig: (envConfig, type, env) => {
    let outputPath = '';
    let inject = envConfig.inject;

    if (type === 'server') {
      // 开发环境不走配置,直接打到dev目录下
      outputPath = join('dev', env);
    }
    else if (type === 'build' || type === 'test') {
      // 不指定输出目录则输出到dist目录下
      outputPath = envConfig.outputPath || join('dist', env);
    }

    // 合并inject
    inject = merge(kConfig.inject, inject);

    return {
      entry: kConfig.entry,
      outputPath: outputPath,
      publicPath: envConfig.publicPath || '/',
      inject
    };
  }
};

// 获取用户输入的信息
program
.version('0.0.1')
.description('一个快速搭建Webpack环境工具')
.option('-t, --type [type]', '运行环境类型,server,build,test')
.option('-p, --port [port]', `端口`, defaultPort)
.option('-e, --env [env]', '上下文环境')
.option('-d, --dll [dll]', '打包公共包', false)
.option('-s, --server [server]', '启服务')
.parse(process.argv);

// 参数判断
if (!program.env) {
  program.env = config.envDefault[program.type];
}

// 端口
const userPort = Math.ceil(program.port);

// 启动服务
const runServer = (devServerPath, port, webpackDevPath, outputPath, publicPath, inject) => {
  require(devServerPath)({
    port,
    webpackConfig: require(webpackDevPath)(outputPath, publicPath),
    inject
  });
};

// 编译
const runBuild = (destServerPath, webpackDestPath, outputPath, publicPath, inject) => {
  require(destServerPath)({
    webpackConfig: require(webpackDestPath)(outputPath, publicPath),
    inject
  });
};

// 打包dll
const runDll = (webpackDllConfig, func = (() => {})) => {
  webpack(webpackDllConfig).run(func);
};

let {type, env, dll, server} = program;

// 当前配置
const currentConfig = config.getEnVConfig(kConfig.env[env], type, env);

// 生产环境起服务
if (server || type === 'test') {
  portIsOccupied(userPort, true, port => {
    if (port !== userPort && userPort !== defaultPort) {
      console.log('您输入的端口', userPort ,'被占用,重新为您分配了一个端口:', port);
    }

    // 编译
    if (type === 'build') {
      console.log('正在删除废弃数据...');
      // 删除之前编译出来的数据,但不删除.git目录
      removeFile(currentConfig.outputPath, ['.git']);
    
      console.log('正在编译中...');
      runDll(require(webpackDestDllPath)(currentConfig.outputPath), () => {
        runBuild(destServerPath, webpackDestPath, currentConfig.outputPath, currentConfig.publicPath, currentConfig.inject);

        require('../server/common/server')(port, router => {
          router.all('*', cxt => {
            cxt.body = fse.readFileSync(resolveApp(currentConfig.outputPath, cxt.url)).toString();
          });
    
          return router;
        });
      });
    }
    // 判断是否编译过
    else if (!fse.existsSync(resolveApp(currentConfig.outputPath))) {
      console.log('启动服务失败,请先[yarn|npm] build');
    }
    else {
      require('../server/common/server')(port, router => {
        router.all('*', cxt => {
          cxt.body = fse.readFileSync(resolveApp(currentConfig.outputPath, cxt.url)).toString();
        });
  
        return router;
      });
    }
  });
}
// 开发环境
else if (type === 'server') {
  currentConfig.outputPath = resolveApp(currentConfig.outputPath);

  // 判断端口是否被占用
  portIsOccupied(userPort, true, port => {
    if (port !== userPort && userPort !== defaultPort) {
      console.log('您输入的端口', userPort ,'被占用,重新为您分配了一个端口:', port);
    }

    let webpackDllConfig = '';

    // 判断是否需要打包dll文件
    if (fse.existsSync(fileTimePath)) {
      let fileTime = require(fileTimePath);
      let devDllTime = fse.lstatSync(webpackDevDllPath).mtimeMs;

      if (devDllTime > fileTime.devDllTime) {
        console.log('正在为您重新构建dll文件...');
        webpackDllConfig = require(webpackDevDllPath)(currentConfig.outputPath);

        fileTime.devDllTime = devDllTime;
        fse.writeFileSync(fileTimePath, JSON.stringify(fileTime));
      }
    }
    else {
      console.log('正在为您构建dll文件...');
      webpackDllConfig = require(webpackDevDllPath)(currentConfig.outputPath);

      fse.mkdirSync(tempPath);
      fse.writeFileSync(fileTimePath, JSON.stringify({
        devDllTime: fse.lstatSync(webpackDevDllPath).mtimeMs
      }));
    }

    console.log('正在为您启动本地服务...');
    if (webpackDllConfig) {
      runDll(webpackDllConfig, () => {

        runServer(devServerPath, port, webpackDevPath, currentConfig.outputPath, currentConfig.publicPath, currentConfig.inject);
      });
    }
    else {
      runServer(devServerPath, port, webpackDevPath, currentConfig.outputPath, currentConfig.publicPath, currentConfig.inject);
    }
  });
}
// 编译环境
else if (type === 'build') {
  console.log('正在删除废弃数据...');
  // 删除之前编译出来的数据,但不删除.git目录
  removeFile(currentConfig.outputPath, ['.git']);

  console.log('正在编译中...');
  runDll(require(webpackDestDllPath)(currentConfig.outputPath), () => {
    runBuild(destServerPath, webpackDestPath, currentConfig.outputPath, currentConfig.publicPath, currentConfig.inject);
  });
}

/*let fileTimeObj = {
  create: () => {
    console.log('正在为您构建dll文件...');
    shell.exec('npm run devdll');

    fs.mkdirSync(tempPath);
    fs.writeFileSync(fileTimePath, JSON.stringify({
      devDllTime: fs.lstatSync(webpackDevDllPath).mtimeMs
    }));
  },
  up: () => {
    let fileTime = require(fileTimePath);
    let devDllTime = fs.lstatSync(webpackDevDllPath).mtimeMs;

    if (devDllTime > fileTime.devDllTime) {
      console.log('正在为您重新构建dll文件...');
      shell.exec('npm run devdll');

      fileTime.devDllTime = devDllTime;
      fs.writeFileSync(fileTimePath, JSON.stringify(fileTime));
    }
  }
};*/
