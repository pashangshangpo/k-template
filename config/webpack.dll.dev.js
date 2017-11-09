const webpack = require('webpack');
const {resolve, join} = require('path');
const library = '[name]_[hash]';
const rootPath = resolve('.', 'dev/js/lib');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'mobx', 'mobx-react']
  },
  output: {
    filename: '[name].dll.js',
    path: rootPath,
    library
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }),
    new webpack.DllPlugin({
      path: join(rootPath, '[name]-manifest.json'),
      name: library
    })
  ]
};