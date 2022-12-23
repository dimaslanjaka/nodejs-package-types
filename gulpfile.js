const { writeFile } = require('fs/promises');
const { spawn } = require('hexo-util');
const { join } = require('path');
const pkgjson = require('./package.json');

/**
 * build project main types
 */
const build = async function (done) {
  try {
    await spawn('tsc', ['-p', 'tsconfig.project.json'], { cwd: __dirname });
    return done();
  } catch {
    //
  }
};

exports.default = async function (done) {
  await build();
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
