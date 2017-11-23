const execSync = require('child_process').execSync;
const fs = require('fs');
const {appDirResolve} = require('../config/config');

// 判断是否存在yarn
const isYarn = () => {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
};

// 判断是否安装过依赖
const isInstall = () => {
  const packageJson = require(appDirResolve('package.json'));
  let nodeModule = '';
  try {
    nodeModule = fs.readdirSync(appDirResolve('node_modules'));
  }
  catch (e) {
    return false;
  }

  const installPackageName = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);

  return Object.keys(installPackageName).every(packageName => {
    return nodeModule.some(item => item === packageName);
  });
};

// 安装依赖
const install = async () => {
  if (!isInstall()) {
    console.log('正在为您安装相关依赖');

    if (isYarn()) {
      execSync('yarn install', {stdio: 'inherit'});
    }
    else {
      execSync('npm install', {stdio: 'inherit'});
    }
  }
};

install();

// 初始化
require('./init.js');
