const {resolveApp} = require('./paths');
const packageJson = require(resolveApp('package.json'));

module.exports = {
  entry: {
    vendor: Object.keys(packageJson.dependencies)
  }
};
