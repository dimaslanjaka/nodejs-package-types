const fs = require("fs-extra");
const path = require("upath");
const pkgjson = require("./package.json");
const { minimatch } = require("minimatch");

/**
 * TypeDoc configuration script
 *
 * Requirements:
 *   - upath, typedoc-plugin-ga, fs-extra, minimatch
 * Update:
 *   curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/typedoc.config.js > typedoc.config.js
 * Repository:
 *   https://github.com/dimaslanjaka/nodejs-package-types/blob/main/typedoc.config.js
 */

const exclude = ["*.test.ts", "*.test.js"];
/**
 * @type {import('typedoc').TypeDocOptions['entryPoints']}
 */
let entryPoints = fs.readdirSync(path.join(__dirname, "src")).map((path) => "./src/" + path);

getFilesRecursively(path.join(__dirname, "src"));
// filter ts only and remove duplicates
entryPoints = entryPoints
  .filter((path) => /.ts$/.test(path))
  .filter((v, i, a) => a.indexOf(v) === i)
  .filter((str) => {
    // validate tests
    const isTest = minimatch(str, "*.test.*", { matchBase: true });
    const isSpec = minimatch(str, "*.spec*.*", { matchBase: true });
    return !isTest && !isSpec;
  });

//console.log(entryPoints);

/**
 * TypeDoc options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
 * @type {import('typedoc').TypeDocOptions}
 */
const defaultOptions = {
  name: pkgjson.projectName || pkgjson.name || "Static Blog Generator Gulp",
  //entryPoints: pkgjson.main.replace('dist', 'src'),
  entryPoints,
  // Output options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
  // NOTE: the out option and the json option cannot share the same directory
  out: "./docs/" + pkgjson.name,
  json: "./docs/" + pkgjson.name + "/info.json",
  entryPointStrategy: "expand",
  gaID: "UA-106238155-1",
  commentStyle: "all",
  hideGenerator: true,
  searchInComments: true,
  cleanOutputDir: true,
  navigationLinks: {
    Homepage: "https://www.webmanajemen.com",
    GitHub: "https://github.com/dimaslanjaka"
  },
  inlineTags: ["@link"],
  readme: "./tmp/typedoc/readme.md",
  // detect tsconfig for build
  tsconfig: fs.existsSync(path.join(__dirname, "tsconfig.build.json"))
    ? "./tsconfig.build.json"
    : fs.existsSync(path.join(__dirname, "tsconfig-build.json"))
      ? "./tsconfig-build.json"
      : "./tsconfig.json",
  //includes: ['src'],
  exclude,
  // htmlLang: "en",
  //gitRemote: 'https://github.com/dimaslanjaka/static-blog-generator-hexo.git',
  gitRevision: "master",
  githubPages: true,
  //theme: 'hierarchy',
  //ignoreCompilerErrors: true,
  logLevel: "Verbose",
  highlightLanguages: [
    "typescript",
    "javascript",
    "json",
    "html",
    "css",
    "bash",
    "shell",
    "cmd",
    "xml",
    "yaml",
    "yml",
    "batch",
    "jsonc",
    "log"
  ],
  //version: true,
  //includeVersion: true
  plugin: [
    "typedoc-plugin-ga"
    //'typedoc-plugin-missing-exports'
  ]
};

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

module.exports = defaultOptions;

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
      entryPoints.push("." + absolute.replace(path.toUnix(__dirname), ""));
      // unique
      entryPoints = entryPoints.filter(function (x, i, a) {
        return a.indexOf(x) === i;
      });
    }
  }
}
