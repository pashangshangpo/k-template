const webpack = require('webpack');
const {resolve, join} = require('path');
const {devDllPath} = require('./config');
const library = '[name]_[hash]';

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'mobx', 'mobx-react']
  },
  output: {
    filename: '[name].dll.js',
    path: devDllPath,
    library
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
    new webpack.DllPlugin({
      path: join(devDllPath, '[name]-manifest.json'),
      name: library
    })
  ]
};
