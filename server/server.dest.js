const fs = require('fs');
const path = require('path');

let webpackPath = process.argv[2];
webpackPath = `${path.resolve('.')}/${webpackPath}`;

// 编译webpack
let webpackConfig = require(webpackPath);

// todo