const fs = require("fs");
const path = require("path");
const axios = require("axios");

function setup(
  options = {
    force: false,
    includes: [
      "packer",
      "postinstall",
      "preinstall",
      ".github/workflows/build-release.yml",
    ],
  }
) {
  const { includes } = options;
  includes.forEach((downloadPath) => {
    const dPath = !downloadPath.endsWith(".js")
      ? downloadPath + ".js"
      : downloadPath;
    const packer = path.join(process.cwd(), dPath);
    if (!fs.existsSync(packer) || options.force) {
      download(
        "https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/main/" +
          dPath,
        path.join(process.cwd(), dPath)
      );
    }
  });
}

function download(url, output) {
  axios.get(url, { responseType: "blob" }).then((response) => {
    fs.writeFile(output, response.data, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  });
}

module.exports = { setup };
