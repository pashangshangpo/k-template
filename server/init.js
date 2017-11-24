const {join} = require('path');
const program = require('commander');
const webpack = require('webpack');
const merge = require('webpack-merge');
const fse = require('fs-extra');
const spawn = require('cross-spawn');
const portIsOccupied = require('./util/portUtil');
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
    else if (type === 'build') {
      // 不指定输出目录则输出到dist目录下
      outputPath = envConfig.outputPath || join('dist', env);
    }

    // 合并inject
    inject = merge(kConfig.inject, inject);

    return {
      entry: kConfig.entry,
      outputPath: resolveApp(outputPath),
      publicPath: envConfig.publicPath || '/',
      inject
    };
  }
};

// 获取用户输入的信息
program
.version('0.0.1')
.description('一个快速搭建Webpack环境工具')
.option('-t, --type [type]', '运行环境类型,server,build')
.option('-p, --port [port]', `端口`, defaultPort)
.option('-e, --env [env]', '上下文环境')
.option('-d, --dll [dll]', '打包公共包', false)
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

// 打包dll
const runDll = (webpackDllConfig, func = (() => {})) => {
  webpack(webpackDllConfig).run(func);
};

// 判断端口是否被占用
portIsOccupied(userPort, true, port => {
  if (port !== userPort && userPort !== defaultPort) {
    console.log('您输入的端口', userPort ,'被占用,重新为您分配了一个端口:', port);
  }

  let {type, env, dll} = program;
  
  // 当前配置
  const currentConfig = config.getEnVConfig(kConfig.env[env], type, env);

  // 根据类型执行不同的事务
  if (type === 'server') {
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
  }
  else if (type === 'build') {
    console.log('正在删除废弃数据...');
    fse.removeSync(currentConfig.outputPath);
  
    console.log('正在为您进行打包...');
  
    // shell.exec(['webpack --config', webpackDestDllPath, `--env.context=${env}`].join(' '));
  
    // shell.exec([
    //   'node',
    //   destServerPath,
    //   env
    // ].join(' '));
  }
});

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
