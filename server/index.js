const execSync = require('child_process').execSync;

// 判断是否存在yarn
const isYarn = () => {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
};

// 安装依赖
const install = async () => {
  console.log('正在为您安装相关依赖');

  if (isYarn()) {
    execSync('yarn install', {stdio: 'inherit'});
  }
  else {
    execSync('npm install', {stdio: 'inherit'});
  }
};

install();

// 初始化
require('./init.js');
