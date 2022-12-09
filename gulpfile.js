const { writeFile } = require('fs/promises');
const { join } = require('path');
const pkgjson = require('./package.json');

exports.default = function (done) {
  const tslint = {
    extends: '@definitelytyped/dtslint/dt.json',
    rules: {
      'unified-signatures': false
    }
  };
  pkgjson.private = true;
  pkgjson.files = ['*.js', 'typings', 'hexo', 'skeljs', 'through2', 'hexo-log', 'hexo-bunyan', 'hexo-util'];
  writeFile(join(__dirname, 'dist/tslint.json'), JSON.stringify(tslint, null, 4));
  writeFile(join(__dirname, 'dist/package.json'), JSON.stringify(pkgjson, null, 4));
  if (typeof done === 'function') done();
};
