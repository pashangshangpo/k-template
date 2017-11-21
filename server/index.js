const fs = require('fs');
const {join} = require('path');
const shell = require('shelljs');
let {
  destPath, 
  devDllPath,
  webpackDevDllPath,
  webpackDestDllPath,
  port,
  devServerPath,
  destServerPath,
  tempPath,
  fileTimePath
} = require('../config/config');
const context = process.argv[2];
let len = process.argv.length;
let devContent = context;

// 判断环境
switch (len) {
  case 5:
    devContent = process.argv[4];
    port = process.argv[3];
    break;
  case 4:
    if (isNaN(process.argv[3])) {
      devContent = process.argv[3];
    }
    else {
      port = process.argv[3];
    }
    break;
}

console.log('正在为您检查相关配置...');


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

switch (context) {
  case 'dev':
    // 判断是否需要打包dll文件
    if (fs.existsSync(fileTimePath)) {
      let fileTime = require(fileTimePath);
      let devDllTime = fs.lstatSync(webpackDevDllPath).mtimeMs;

      if (devDllTime > fileTime.devDllTime) {
        console.log('正在为您重新构建dll文件...');
        shell.exec(['webpack --config', webpackDevDllPath, `--env.context=${devContent}`].join(' '));
        
        fileTime.devDllTime = devDllTime;
        fs.writeFileSync(fileTimePath, JSON.stringify(fileTime));
      }
    }
    else {
      console.log('正在为您构建dll文件...');
      shell.exec(['webpack --config', webpackDevDllPath, `--env.context=${devContent}`].join(' '));

      fs.mkdirSync(tempPath);
      fs.writeFileSync(fileTimePath, JSON.stringify({
        devDllTime: fs.lstatSync(webpackDevDllPath).mtimeMs
      }));
    }

    console.log('正在为您启动本地服务...');
    shell.exec([
      'node',
      devServerPath,
      port,
      devContent
    ].join(' '));
    break;
  case 'dest':
    console.log('正在删除废弃数据...');
    shell.rm('-rf', destPath);

    console.log('正在为您进行打包...');

    shell.exec(['webpack --config', webpackDestDllPath, `--env.context=${devContent}`].join(' '));

    shell.exec([
      'node',
      destServerPath,
      devContent
    ].join(' '));
    break;
}
