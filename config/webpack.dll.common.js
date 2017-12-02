const {resolveApp} = require('./paths');
const packageJson = require(resolveApp('package.json'));

module.exports = {
  entry: {
    vendor: Object.keys(packageJson.dependencies)
  },
  resolve: {
    cacheWithContext: true,
    extensions: ['.js', '.css'],
    modules: ['node_modules']
  }
};
