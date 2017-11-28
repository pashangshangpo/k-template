const {resolveApp} = require('./paths');
const packageJson = require(resolveApp('package.json'));
const dependencies = packageJson.dependencies;
// 提取key
// const result = {};
// for (let key in dependencies) {
//   if (dependencies.hasOwnProperty(key)) {
//     result[key] = [key];
//   }
// }

console.log(result);
module.exports = {
  entry: {
    main: Object.keys(packageJson.dependencies)
  }
};

