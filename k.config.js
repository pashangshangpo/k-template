module.exports = {
  entry: './src/index.js',
  inject: {
    css: [],
    js: []
  },
  env: {
    dev: {
      publicPath: '/',
      outputPath: './dev',
      inject: {
        js: [
          function () {
            window.CONTEXT = 'dev';
          }
        ]
      }
    },
    dest: {
      publicPath: '/',
      outputPath: './dist/dest'
    }
  }
};
