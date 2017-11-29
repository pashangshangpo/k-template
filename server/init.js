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

const packageName = 'package.json';
const packagePath = resolveApp(packageName);

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
  console.log('正在为您启动本地服务...');  
  require(devServerPath)({
    port,
    webpackConfig: require(webpackDevPath)(outputPath, publicPath),
    inject
  });
};

// 编译
const runBuild = (destServerPath, webpackDestPath, outputPath, publicPath, inject, func = (() => {})) => {
  require(destServerPath)({
    webpackConfig: require(webpackDestPath)(outputPath, publicPath),
    inject,
    func
  });
};

// 打包dll
const runDll = (webpackDllConfig, func = (() => {})) => {
  console.log('正在为您构建dll文件...');  
  webpack(webpackDllConfig).run(func);
};

// 编译dest
const runDest = (currentConfig, func = () => {}) => {
  console.log('正在删除废弃数据...');
  // 删除之前编译出来的数据,但不删除.git目录
  removeFile(resolveApp(currentConfig.outputPath), ['.git']);

  console.log('正在编译中...');
  if (isDll()) {
    runDll(require(webpackDestDllPath)(currentConfig.outputPath), () => {
      runBuild(
        destServerPath,
        webpackDestPath,
        currentConfig.outputPath,
        currentConfig.publicPath,
        currentConfig.inject,
        func
      );
    });
  }
  else {
    runBuild(
      destServerPath,
      webpackDestPath,
      currentConfig.outputPath,
      currentConfig.publicPath,
      currentConfig.inject,
      func
    );
  }
};

// destServer
const destServer = (port, outputPath) => {
  console.log('正在为您启动本地服务...');

  require('../server/common/server')(port, outputPath);
};

let {type, env, dll, server} = program;

  // 判断是否需要打包dll文件
const isDll = () => {
  let prePackagePath = resolveApp(tempPath, packageName);

  // 如果没有temp文件夹则认为是初次打包
  if (fse.existsSync(prePackagePath)) {
    // 判断依赖是否更新,如果更新则重新打包dll
    if (JSON.stringify(require(prePackagePath).dependencies) !== JSON.stringify(require(packagePath).dependencies)) {
      fse.copySync(packagePath, prePackagePath);
      return true;
    }
    return false;
  }
  else {
    fse.mkdirSync(tempPath);
    fse.copySync(packagePath, prePackagePath);

    return true;
  }
};

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
      runDest(currentConfig, destServer.bind(null, port, currentConfig.outputPath));
    }
    // 判断是否编译过
    else if (!fse.existsSync(resolveApp(currentConfig.outputPath))) {
      console.log('启动服务失败,请先[yarn|npm] build');
    }
    else {
      destServer(port, currentConfig.outputPath);
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

    if (isDll()) {
      runDll(require(webpackDevDllPath)(currentConfig.outputPath), () => {
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
  runDest(currentConfig);
}
