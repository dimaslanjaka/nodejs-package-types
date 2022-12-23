const { existsSync, rmSync } = require('fs');
const { mkdirp } = require('fs-extra');
const { writeFile } = require('fs/promises');
const gulp = require('gulp');
const { spawn } = require('hexo-util');
const { join } = require('path');
const pkgjson = require('./package.json');

/**
 * build project main types
 */
const build = async function (done) {
  try {
    const dest = join(__dirname, 'tmp/typings/main');
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    await spawn('tsc', ['-p', 'tsconfig.project.json'], { cwd: __dirname });
    gulp.src('*.*', { cwd: dest }).pipe(gulp.dest(join(__dirname, 'typings/main')));
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    if (typeof done === 'function') done();
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
  mkdirp(join(__dirname, 'dist'));
  writeFile(join(__dirname, 'dist/tslint.json'), JSON.stringify(tslint, null, 4));
  writeFile(join(__dirname, 'dist/package.json'), JSON.stringify(pkgjson, null, 4));
  if (typeof done === 'function') done();
};
