const fs = require('fs');
const { join } = require('path');
const path = require('upath');
const pkgjson = require('./package.json');
const { minimatch } = require('minimatch');

// required: npm i upath
// required: npm i -D typedoc typedoc-plugin-missing-exports
// update   : curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/typedoc.config.js > typedoc.config.js
// repo     : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/typedoc.config.js

const tmp = path.join(__dirname, 'tmp/typedoc');
const exclude = ['*.test.ts', '*.test.js'];
/**
 * @type {import('typedoc').TypeDocOptions['entryPoints']}
 */
let entryPoints = fs.readdirSync(path.join(__dirname, 'src')).map((path) => './src/' + path);

getFilesRecursively(path.join(__dirname, 'src'));
// filter ts only and remove duplicates
entryPoints = entryPoints
  .filter((path) => /.ts$/.test(path))
  .filter((v, i, a) => a.indexOf(v) === i)
  .filter((str) => {
    // validate tests
    const isTest = minimatch(str, '*.test.*', { matchBase: true });
    const isSpec = minimatch(str, '*.spec*.*', { matchBase: true });
    return !isTest && !isSpec;
  });

//console.log(entryPoints);

/**
 * Build Readme
 */
const readme = [path.join(__dirname, 'readme.md'), path.join(__dirname, 'README.md')].filter((str) =>
  fs.existsSync(str)
)[0];
if (typeof readme === 'string') {
  if (fs.existsSync(readme)) {
    let content = fs.readFileSync(readme, 'utf-8');

    // add changelog if exist
    const changelog = [path.join(__dirname, 'changelog.md'), path.join(__dirname, 'CHANGELOG.md')].filter((str) =>
      fs.existsSync(str)
    )[0];
    if (typeof changelog === 'string') {
      content += '\n\n' + fs.readFileSync(changelog, 'utf-8');
    }

    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
    fs.writeFileSync(path.join(tmp, 'readme.md'), content);
  }
}

/**
 * TypeDoc options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
 * @type {import('typedoc').TypeDocOptions}
 */
const defaultOptions = {
  name: pkgjson.projectName || pkgjson.name || 'Static Blog Generator Gulp',
  //entryPoints: pkgjson.main.replace('dist', 'src'),
  entryPoints,
  // Output options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
  // NOTE: the out option and the json option cannot share the same directory
  out: './docs/' + pkgjson.name,
  json: './docs/' + pkgjson.name + '/info.json',
  entryPointStrategy: 'expand',
  gaID: 'UA-106238155-1',
  commentStyle: 'all',
  hideGenerator: true,
  searchInComments: true,
  cleanOutputDir: true,
  navigationLinks: {
    Homepage: 'https://www.webmanajemen.com',
    GitHub: 'https://github.com/dimaslanjaka'
  },
  inlineTags: ['@link'],
  readme: './tmp/typedoc/readme.md',
  // detect tsconfig for build
  tsconfig: fs.existsSync(path.join(__dirname, 'tsconfig.build.json'))
    ? './tsconfig.build.json'
    : fs.existsSync(path.join(__dirname, 'tsconfig-build.json'))
      ? './tsconfig-build.json'
      : './tsconfig.json',
  //includes: ['src'],
  exclude,
  htmlLang: 'en',
  //gitRemote: 'https://github.com/dimaslanjaka/static-blog-generator-hexo.git',
  gitRevision: 'master',
  githubPages: true,
  //theme: 'hierarchy',
  //plugin: ['typedoc-plugin-missing-exports'],
  //ignoreCompilerErrors: true,
  logLevel: 'Verbose'
  //version: true,
  //includeVersion: true
};

const generatedOptionFile = join(tmp, 'options.json');
let localTypedocOptions = defaultOptions;
if (fs.existsSync(generatedOptionFile)) {
  localTypedocOptions = JSON.parse(readfile(generatedOptionFile, 'utf-8'));
  localTypedocOptions = Object.assign(defaultOptions, localTypedocOptions);
}

/*
const cjson = path.join(__dirname, 'typedoc.json');
const scriptName = path.basename(__filename);

// run json creation when filename endswith -config.js
if (scriptName.endsWith('-config.js')) {
  typedocOptions['$schema'] = 'https://typedoc.org/schema.json';
  fs.writeFileSync(cjson, JSON.stringify(typedocOptions, null, 2));
} else {
  if (fs.existsSync(cjson)) fs.rm(cjson);
}*/

/**
 * read file with validation
 * @param {string} str
 * @param {import('fs').EncodingOption} encoding
 * @returns
 */
function readfile(str, encoding = 'utf-8') {
  if (fs.existsSync(str)) {
    if (fs.statSync(str).isFile()) {
      return fs.readFileSync(str, encoding);
    } else {
      throw str + ' is directory';
    }
  } else {
    throw str + ' not found';
  }
}

module.exports = localTypedocOptions;

/**
 * read files recursively then push to {@link entryPoints}
 * @param {string} directory
 */
function getFilesRecursively(directory) {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      entryPoints.push('.' + absolute.replace(path.toUnix(__dirname), ''));
      // unique
      entryPoints = entryPoints.filter(function (x, i, a) {
        return a.indexOf(x) === i;
      });
    }
  }
}
