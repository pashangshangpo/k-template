const fs = require('fs');
const {join} = require('path');
const fse = require('fs-extra');

// 添加query
const addQuery = (url, obj) => {
	let str = '';
	if (url.lastIndexOf('?') !== -1) {
		for (let key in obj) {
			str += `&${key}=${obj[key]}`;
		}
		return [url, str].join('');
	} else {
		let i = 0;
		for (let key in obj) {
			if (i === 0) {
				str += `?${key}=${obj[key]}`;
			} else {
				str += `&${key}=${obj[key]}`;
			}
			i += 1;
		}
		return [url, str].join('');
	}
};

module.exports = {
	// 替换模板内容
	replace: (html, obj, $ = '@') => {
		for (let key in obj) {
			html = html.replace(new RegExp(`${$}${key}${$}`, 'g'), obj[key]);
		}

		return html;
	},
	// 文件内容替换
	fileContentReplace: (filePath, keys) => {
	  let html = '';
		for (let key in keys) {
			html = fs.readFileSync(filePath).toString().replace(new RegExp(key), keys[key]);
		}
		fs.writeFileSync(filePath, html);

		return html;
	},
	// 向html添加css
	appendCss: (html, css, addTime) => {
	  let arr = [];
		for (let item of css) {
			item = addTime
				? addQuery(item, {
					dateTime: Date.now()
				})
				: item;

			arr.push(`<link rel="stylesheet" type="text/css" href="${item}">`);
		}

	  return html.replace(/<head>([\s\S]*)<\/head>/, ['<head>$1', arr.join('\n'), '</head>'].join('\n'));
	},
	// 向html添加js
	appendJs: (html, js, addTime) => {
	  let arr = [];
	  for (let item of js) {
	    if (typeof item === 'string') {
				item = addTime
					? addQuery(item, {
						dateTime: Date.now()
					})
					: item;

	      arr.push(`<script src="${item}"></script>`);
			} else {
	      arr.push(`<script>;(${item}());</script>`);
			}
		}

		return html.replace(/<body>([\s\S]*)<\/body>/, ['<body>$1', arr.join('\n'), '</body>'].join('\n'));
	},
	// 获取本机ip地址
	getIp: () => {
		let os = require('os'),
			ipStr,
			infaces = os.networkInterfaces(),
			bool = false;

		for (let i in infaces) {
			infaces[i].some(x => {
				if ((x.family === 'IPv4') && (x.internal === false)) {
					ipStr = x.address;
					bool = true;
					return true;
				}
			});

			if (bool) {
				break;
			}
		}

		return ipStr;
	},
	// 判断类型
	type: el => {
	  return el.constructor.name;
	},
	// join字符串
	joinStr(arr) {
		if (Array.isArray(arr)) {
			return arr.join('');
		}

		return [].slice.apply(arguments).join('');
	},
	// 删除文件
	removeFile: (path, filter) => {
		try {
			filter.forEach(item => {
				fse.moveSync(join(path, item), join(path, '../', item));
			});
		} catch (err) {}

		try {
			fse.removeSync(path);
		} catch (err) {}

		try {
			filter.forEach(item => {
				fse.moveSync(join(path, '../', item), join(path, item));
			});
		} catch (err) {}
	},
	each: (obj, func) => {
		for (let key in obj) {
			func(obj[key], key);
		}
	}
};
