const fs = require('fs');
const path = require('path')
const axios = require('axios')

function setup(force = false) {
  const packer = path.join(process.cwd(), 'packer.js');
  if (!fs.existsSync(packer) || force) {
    download('https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/main/packer.js', packer);
  }
  const packerGithubActions = path.join(process.cwd(), '.github/workflows/build-release.yml');
  if (!fs.existsSync(packerGithubActions) || force) {
    download('https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/main/.github/workflows/build-release.yml', packerGithubActions);
  }
}

function download(url, output) {
  axios.get(url, {responseType: 'blob'}).then(response => {
    fs.writeFile(output, response.data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
  });
}

module.exports = { setup }
