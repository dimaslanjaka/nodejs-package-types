const fs = require("fs-extra");
const path = require("upath");
const pkgjson = require("./package.json");
const { minimatch } = require("minimatch");
const { marked } = require("marked");

/**
 * TypeDoc configuration script
 *
 * Requirements:
 *   - npm i upath
 *   - npm i -D typedoc typedoc-plugin-missing-exports
 * Update:
 *   curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/typedoc.config.js > typedoc.config.js
 * Repository:
 *   https://github.com/dimaslanjaka/nodejs-package-types/blob/main/typedoc.config.js
 */

const tmp = path.join(__dirname, "tmp/typedoc");
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
 * Build Readme
 */
const readme = [path.join(__dirname, "readme.md"), path.join(__dirname, "README.md")].filter((str) =>
  fs.existsSync(str)
)[0];
const outputReadme = path.join(tmp, "readme.md");
if (typeof readme === "string") {
  if (fs.existsSync(readme)) {
    let content = fs.readFileSync(readme, "utf-8");

    // add changelog if exist
    const changelog = [path.join(__dirname, "changelog.md"), path.join(__dirname, "CHANGELOG.md")].filter((str) =>
      fs.existsSync(str)
    )[0];
    if (typeof changelog === "string") {
      content += "\n\n" + fs.readFileSync(changelog, "utf-8");
    }

    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
    fs.writeFileSync(outputReadme, content);
  }
}

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

// Extract local link from readme
const readmeContent = fs.readFileSync(outputReadme, "utf-8");
const hyperlinks = extractAllLocalLinks(readmeContent);
for (const link of hyperlinks) {
  // Only process local links (not http/https)
  if (!/^https?:\/\//i.test(link)) {
    const absolutePath = path.resolve(__dirname, link);
    if (fs.existsSync(absolutePath)) {
      const destinationPath = path.join(tmp, link);
      console.log(`📄 Copying local link "${link}":\n  Source: "${absolutePath}"\n  Destination: "${destinationPath}"`);
      fs.copySync(absolutePath, destinationPath);
    }
  }
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

/**
 * Extracts all local links (including images, reference, and raw URLs) from markdown text.
 * @param {string} markdownText - Markdown content to parse.
 * @returns {string[]} Array of local link paths.
 */
function extractAllLocalLinks(markdownText) {
  const links = new Set();
  const tokens = marked.lexer(markdownText);
  // Collect reference definitions
  const referenceDefs = {};
  for (const token of tokens) {
    if (token.type === "def") {
      referenceDefs[token.tag] = token.href;
    }
  }
  function walkTokens(tokens) {
    for (const token of tokens) {
      // Standard links
      if (token.type === "link" && token.href) {
        links.add(token.href);
      }
      // Images
      if (token.type === "image" && token.href) {
        links.add(token.href);
      }
      // Reference-style links
      if (token.type === "text" && token.tokens) {
        for (const t of token.tokens) {
          if (t.type === "link" && t.href) {
            links.add(t.href);
          }
          if (t.type === "image" && t.href) {
            links.add(t.href);
          }
          // Reference link: [text][ref]
          if (t.type === "link" && t.ref && referenceDefs[t.ref]) {
            links.add(referenceDefs[t.ref]);
          }
        }
      }
      // Raw URLs in text
      if (token.type === "paragraph" && token.text) {
        // Match local file paths, skip lookbehind for compatibility
        // Compatible regex for local file paths (no lookbehind, valid escapes)
        const urlRegex = /(\.\/|\.\.\/|\/)?[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]{2,}/g;
        let match;
        while ((match = urlRegex.exec(token.text)) !== null) {
          links.add(match[0]);
        }
      }
      if (token.tokens) {
        walkTokens(token.tokens);
      }
    }
  }
  walkTokens(tokens);
  // Remove external links
  return Array.from(links).filter((href) => !/^https?:\/\//i.test(href));
}
