const fs = require('fs');
const {resolve, join} = require('path');
const {appendCss, appendJs, replace} = require('./util/util');
const webpack = require('webpack');
const {
  webpackDestPath, 
  destHtmlPath, 
  destPath,
  dllPath,
  injectPath,
  indexMapDest,
  dllMapDest
} = require('../config/config');
const webpackConfig = require(webpackDestPath);
const entry = webpackConfig.entry;
const dest = require(injectPath).dest;

// 构建
const compiler = webpack(webpackConfig);

compiler.run((err, status) => {
  if (err) {
		console.log(err);
	}
	else {
    const indexMap = require(indexMapDest);
    const dllMap = require(dllMapDest);

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
        indexCssPath: indexMap.index.css,
        indexJsPath: indexMap.index.js,
        commonJsPath: indexMap.common.js,
        dllJsPath: join(dllPath, dllMap.vendor.js),
        entryName: key,
        dateTime: Date.now()
      }));
    }

		console.log('构建完成');

    fs.unlinkSync(indexMapDest);
    fs.unlinkSync(dllMapDest);
	}
});
