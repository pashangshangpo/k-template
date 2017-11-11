const {resolve, join} = require('path');

// 根路径
const root = resolve('.');
// 项目名
const project = root.split('/').pop();

module.exports = {
  root,
  project
};
