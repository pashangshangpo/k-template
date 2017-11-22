module.exports = {
  entry: {
    index: [
      './src/index.js'
    ]
  },
  env: {
    dest: {
      publicPath: '/',
      outputPath: './dist/dest'
    },
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
    qa: {
      publicPath: '/',
      outputPath: './qa',
      inject: {
        js: [
          function () {
            window.CONTEXT = 'qa';
          }
        ]
      }
    }
  }
};
