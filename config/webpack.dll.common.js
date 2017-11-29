const {resolveApp} = require('./paths');
const packageJson = require(resolveApp('package.json'));

module.exports = {
  entry: {
    main: Object.keys(packageJson.dependencies)
  }
};
