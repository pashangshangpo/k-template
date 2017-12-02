const fse = require('fs-extra');
const {fileContentReplace} = require('./util/util');
const {project, resolveApp} = require('../config/paths');
const ideaName = process.argv[2];
const filter = [
	'.git',
	'README.md',
	'node_modules',
	'.DS_Store',
	'.idea',
	'dev',
	'dist',
	'temp'
];

if (!ideaName) {
	console.log('请输入项目名, 如: [yarn|npm] new react-demo');
	return false;
}

// 模板路径
const templatePath = resolveApp();
// 目标路径
const targetPath = resolveApp('../', ideaName);

// 复制模板
fse.copySync(templatePath, targetPath, {filter: fileName => {
	return !filter.some(name => {
		return resolveApp(name) === fileName;
	});
}});

// 替换package name
fileContentReplace(targetPath + '/package.json', {
	[project]: ideaName
});

console.log(`项目创建完成, 请cd ../${ideaName}`);
