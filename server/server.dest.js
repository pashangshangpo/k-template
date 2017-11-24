const fs = require('fs');
const {resolve, join} = require('path');
const {appendCss, appendJs, replace} = require('./util/util');
const webpack = require('webpack');
const minify = require('html-minifier').minify;
const {
  templatePath, 
  dllPath,
  indexMap,
  dllMap,
  kConfigPath
} = require('../config/config');

module.exports = (webpackConfig, inject) => {
  const entry = webpackConfig.entry;
  const outputPath = webpackConfig.output.path;
  const publicPath = webpackConfig.output.publicPath;

  const indexMapDest = join(outputPath, indexMap);
  const dllMapDest = join(outputPath, dllMap);

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
      let html = fs.readFileSync(templatePath).toString();

      // 向模板中注入代码
      for (let key of Object.keys(inject)) {
        let section = inject[key];
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
        fs.writeFileSync(join(root, outputPath, `${key}.html`), minify(replace(html, {
          indexCssPath: indexMap.index.css,
          indexJsPath: indexMap.index.js,
          commonJsPath: indexMap.common.js,
          dllJsPath: join(dllPath, dllMap.vendor.js),
          entryName: key,
          dateTime: Date.now()
        }), {
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }));
      }

      console.log('构建完成');

      fs.unlinkSync(indexMapDest);
      fs.unlinkSync(dllMapDest);
    }
  });
};