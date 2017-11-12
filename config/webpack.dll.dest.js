const webpack = require('webpack');
const {resolve, join} = require('path');
const {destDllPath} = require('./config');
const library = '[name]_[hash]';

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'mobx', 'mobx-react']
  },
  output: {
    filename: '[name].dll.js',
    path: destDllPath,
    library
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.DllPlugin({
      path: join(destDllPath, '[name]-manifest.json'),
      name: library
    })
  ]
};
