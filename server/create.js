const {resolve, join} = require('path');
const fs = require('fs');
const shell = require('shelljs');
const {root, project} = require('../config/config');
const ideaName = process.argv[2];
const filter = [
    '.git',
    'README.md',
    'node_modules',
    '.DS_Store',
    '.idea'
];


if (!ideaName) {
    console.log('请输入项目名, 如: npm run create react-demo');
    return false;
}

// 获取当前路径
let pwd = () => {
    return shell.pwd().stdout;
};

// 过滤文件
let filterFile = (source, filter) => {
    return source.filter(key => {
        return !filter.some(item => key === item);
    });
};

// 复制文件
const cp = (source, name) => {
  const tplPath = pwd();
  shell.cd('../');
  const curPath = pwd();
  shell.mkdir(join(curPath, name));

  source.forEach(key => {
      shell.cp('-Rf', join(tplPath, key), join(curPath, name, key));
  });
};

cp(
    filterFile(shell.ls('-A'), filter),
    ideaName
);

// 文件内容替换
const fileContentReplace = (filePath, keys) => {
  for (let key in keys) {
    fs.writeFileSync(filePath, fs.readFileSync(filePath).toString().replace(key, keys[key]));
  }
};

fileContentReplace(join(pwd(), ideaName, 'package.json'), {
  [project]: ideaName
});

console.log(`项目创建完成, 请cd ../${ideaName}`);
