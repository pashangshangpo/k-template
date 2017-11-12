const fs = require('fs');
const {resolve, join} = require('path');
const {appendCss, appendJs, replace} = require('./util/util');
const webpack = require('webpack');
const {webpackDestPath, destHtmlPath, destPath, injectPath} = require('../config/config');
const webpackConfig = require(webpackDestPath);
const entry = webpackConfig.entry;
const dest = require(injectPath).dest;

// 模板内容
let html = fs.readFileSync(destHtmlPath).toString();

// 向模板中注入代码
for (let key of Object.keys(dest)) {
  let section = dest[key];
  if (section.length > 0) {
    if (key === 'css') {
      html = appendCss(html, section);
    }
    else if (key === 'js') {
      html = appendJs(html, section);
    }
  }
}

// 替换模板
for (let key in entry) {
	fs.writeFileSync(join(destPath, `${key}.html`), replace(html, {
		entryName: key,
		dateTime: Date.now()
	}));
}

// 构建
const compiler = webpack(webpackConfig);
compiler.run((err, status) => {
  if (err) {
		console.log(err);
	}
	else {
		console.log('构建完成');
	}
});
