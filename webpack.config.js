const path = require('path');

module.exports = {
  entry: './src/coordiscroll.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'coordiscroll.js'
  }
};