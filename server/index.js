const fs = require('fs');
const shell = require('shelljs');
let {
  destPath, 
  devDllPath, 
  destDllPath, 
  port, 
  devServerPath, 
  destServerPath
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

switch (context) {
  case 'dev':
    // 判断是否有打包dll文件
    if (!fs.existsSync(devDllPath)) {
      console.log('正在为您构建dll静态文件...');
      shell.exec('npm run devdll');
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
    shell.exec('npm run destdll');

    shell.exec([
      'node',
      destServerPath
    ].join(' '));
    break;
}
