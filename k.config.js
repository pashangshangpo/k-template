module.exports = {
  entry: {
    index: [
      './src/index.js'
    ]
  },
  env: {
    dev: {
      publicPath: '/',
      outputPath: './aaa',
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
