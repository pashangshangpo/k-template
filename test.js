const fse = require('fs-extra');
const {resolve} = require('path');
const acorn = require('acorn');
const ast = acorn.parse(
  fse.readFileSync(resolve('.', 'api/api.js')).toString(),
  {
    sourceType: 'module',
    locations: true,
    ranges: true,
    onToken: (a, b) => {
      console.log(a, b);
    }
    // onComment: (block, text, start, end, loc, range) => {
    //   console.log(block, text, start, end, loc, range);
    // }
  }
);
