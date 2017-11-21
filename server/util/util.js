const fs = require('fs');

const addQuery = (query, obj) => {
  let str = '';
  if (query.lastIndexOf('?') !== -1) {
    for (let key in obj) {
      str += `&${key}=${obj[key]}`;
    }
    return [query, str].join('');
  }
  else {
    let i = 0;
    for (let key in obj) {
      if (i === 0) {
        str += `?${key}=${obj[key]}`;
      }
      else {
        str += `&${key}=${obj[key]}`;
      }
      i += 1;
    }
    return [query, str].join('');
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
  appendCss: (html, css) => {
	  let arr = [];
    for (let item of css) {
      arr.push(`    <link rel="stylesheet" href="${item}">`);
    }

	  return html.replace(/<head>([\s\S]*)<\/head>/, ['<head>$1', arr.join('\n'), '</head>'].join('\n'));
  },
  // 向html添加js
  appendJs: (html, js) => {
	  let arr = [];
	  for (let item of js) {
	    if (typeof item === 'string') {
	      arr.push(`    <script src="${item}"></script>`);
      }
      else {
	      arr.push(`    <script>;(${item}());</script>`);
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

    for(let i in infaces){
      infaces[i].some(x => {
        if((x.family === 'IPv4') && (x.internal === false)) {
          ipStr = x.address;
          bool = true;
          return true
        }
      });

      if(bool){
        break
      }
    }

    return ipStr
  },
  // 判断类型
  type: el => {
	  return el.constructor.name;
  }
};
