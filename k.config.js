module.exports = {
  entry: {
    index: [
      './src/index.js'
    ]
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
