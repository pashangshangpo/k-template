const fs = require('fs');
const {resolve, join} = require('path');
const {appendCss, appendJs, replace, joinStr} = require('./util/util');
const webpack = require('webpack');
const minify = require('html-minifier').minify;
const {
  resolveApp,
  templatePath, 
  dllPath,
  indexMap,
  dllName,
  dllMap,
  kConfigPath,
  manifestName
} = require('../config/paths');

module.exports = ({webpackConfig, inject = {}} = config) => {
  const entry = webpackConfig.entry;
  const outputPath = webpackConfig.output.path;

  const indexMapDest = join(outputPath, indexMap);
  const dllMapDest = join(outputPath, dllMap);
  const dllMapConfig = require(dllMapDest);

  inject.css = inject.css || [];
  inject.js = inject.js || [];

  // 引用dll包
  for (let key in dllMapConfig) {
    let name = dllMapConfig[key].js;
    inject.js.push(join(dllPath, name));

    webpackConfig.plugins.push(
      new webpack.DllReferencePlugin({
        manifest: require(join(outputPath, dllPath, joinStr(name.slice(0, name.indexOf(dllName) - 1), '.', manifestName)))
      })
    );
  }

  // 构建
  const compiler = webpack(webpackConfig);

  compiler.run((err, status) => {
    if (err) {
      console.log(err);
    }
    else {
      const indexMapConfig = require(indexMapDest);

      inject.css = inject.css || [];
      inject.js = inject.js || [];


      indexMapConfig.index.css ? inject.css.push(indexMapConfig.index.css) : '';
      inject.js.push(joinStr(indexMapConfig.common.js));
      inject.js.push(joinStr(indexMapConfig.index.js));

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
        fs.writeFileSync(resolveApp(outputPath, `${key}.html`), minify(html, {
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
