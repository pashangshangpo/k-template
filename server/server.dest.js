const fs = require('fs');
const {resolve, join} = require('path');
const util = require('./util/util');
const webpack = require('webpack');
const webpackConfig = require(resolve('.', 'config/webpack.dest.config.js'));
const entry = webpackConfig.entry;
const html = fs.readFileSync(resolve('.', 'config/dest.html')).toString();

for (let key in entry) {
	fs.writeFileSync(resolve('.', 'dest', `${key}.html`), util.replace(html, {
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
