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
  kConfigPath
} = require('../config/paths');

const kConfig = require(kConfigPath);

const packageName = 'package.json';
const packagePath = resolveApp(packageName);

// 配置
const config = {
  envDefault: {
    start: 'dev',
    build: 'dest',
    server: 'dest'
  },
  getEnVConfig: (envConfig, type, env) => {
    let outputPath = '';
    if (type === 'start') {
      // 开发环境不走配置,直接打到dev目录下
      outputPath = join('dev', env);
    }
    else if (type === 'build' || type === 'server') {
      // 不指定输出目录则输出到dist目录下
      outputPath = envConfig.outputPath || join('dist', env);
    }

    return {
      entry: kConfig.entry,
      outputPath: outputPath,
      publicPath: envConfig.publicPath || '/',
      // 合并inject      
      inject: merge(kConfig.inject, envConfig.inject),
      // 合并move
      move: merge({move: []}, {move: kConfig.move}, {move: envConfig.move}).move,
      autoOpenBrowser: kConfig.autoOpenBrowser
    };
  }
};

// 获取用户输入的信息
program
.version('0.0.1')
.description('一个快速搭建Webpack环境工具')
.option('-t, --type [type]', '你要执行的命令是?如:start,build,server')
.option('-p, --port [port]', `端口`, defaultPort)
.option('-e, --env [env]', '上下文环境')
.option('-s, --server [server]', '生产环境起服务,调试')
.parse(process.argv);

// 参数判断
if (!program.env) {
  program.env = config.envDefault[program.type];
}

// 端口
const userPort = Math.ceil(program.port);

// 启动服务
const runServer = (devServerPath, port, webpackDevPath, outputPath, publicPath, inject, autoOpenBrowser) => {
  console.log('正在为您启动本地服务...');  
  require(devServerPath)({
    port,
    webpackConfig: require(webpackDevPath)(outputPath, publicPath),
    inject,
    autoOpenBrowser
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

// 平移文件
const moveFile = (moveList, movePath) => {
  moveList.forEach(path => {
    path = resolveApp(path);
    let moveToPath = resolveApp(movePath, path.split('/').pop());

    // 平移之前清空文件夹
    if (fse.existsSync(moveToPath)) {
      fse.emptyDirSync(moveToPath);
    }
    if (fse.existsSync(path)) {
      fse.copySync(path, moveToPath);
    }
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

  runDll(require(webpackDestDllPath)(currentConfig.outputPath), () => {
    console.log('正在编译中...');
    runBuild(
      destServerPath,
      webpackDestPath,
      currentConfig.outputPath,
      currentConfig.publicPath,
      currentConfig.inject,
      func
    );
  });
};

// destServer
const destServer = (port, outputPath, autoOpenBrowser) => {
  console.log('正在为您启动本地服务...');

  require('../server/common/server')(port, outputPath, autoOpenBrowser);
};

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

let {type, env, server} = program;

// 当前配置
const currentConfig = config.getEnVConfig(kConfig.env[env], type, env);

moveFile(currentConfig.move, currentConfig.outputPath);

// 生产环境起服务
if (server || type === 'server') {
  portIsOccupied(userPort, true, port => {
    if (port !== userPort && userPort !== defaultPort) {
      console.log('您输入的端口', userPort ,'被占用,重新为您分配了一个端口:', port);
    }

    // 编译
    if (type === 'build') {
      runDest(currentConfig, destServer.bind(null, port, currentConfig.outputPath, currentConfig.autoOpenBrowser));
    }
    // 判断是否编译过
    else if (!fse.existsSync(resolveApp(currentConfig.outputPath))) {
      console.log('启动服务失败,请先[yarn|npm] build');
    }
    else {
      destServer(port, currentConfig.outputPath, currentConfig.autoOpenBrowser);
    }
  });
}
// 开发环境
else if (type === 'start') {
  currentConfig.outputPath = resolveApp(currentConfig.outputPath);

  // 判断端口是否被占用
  portIsOccupied(userPort, true, port => {
    if (port !== userPort && userPort !== defaultPort) {
      console.log('您输入的端口', userPort ,'被占用,重新为您分配了一个端口:', port);
    }

    // 判断dll是否有更新,并且之前打包过的目录存在
    if (isDll() || !fse.existsSync(currentConfig.outputPath)) {
      runDll(require(webpackDevDllPath)(currentConfig.outputPath), () => {
        runServer(
          devServerPath, 
          port, 
          webpackDevPath, 
          currentConfig.outputPath, 
          currentConfig.publicPath, 
          currentConfig.inject,
          currentConfig.autoOpenBrowser
        );
      });
    }
    else {
      runServer(
        devServerPath, 
        port, 
        webpackDevPath, 
        currentConfig.outputPath, 
        currentConfig.publicPath, 
        currentConfig.inject,
        currentConfig.autoOpenBrowser
      );
    }
  });
}
// 编译环境
else if (type === 'build') {
  runDest(currentConfig);
}
