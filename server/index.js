const fs = require('fs');
const shell = require('shelljs');
const {devDllPath, devServerPath, port} = require('../config/config');
const context = process.argv[2];

console.log('正在为您检查相关配置');

// 判断是否有打包dll文件
if (!fs.existsSync(devDllPath)) {
  console.log('正在为您构建dll静态文件');
  shell.exec('npm run devdll');
}

console.log('正在为您启动本地服务');

switch (context) {
  case 'dev':
    shell.exec(`node ${devServerPath} ${port}`);
    break;
  case 'dest':
    break;
}
