import { func } from "../../Library/Caches/typescript/2.6/node_modules/@types/assert-plus";

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
