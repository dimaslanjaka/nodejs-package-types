const fs = require('fs');
const path = require('path');
const axios = require('axios');

function setup(
  options = {
    force: false,
    includes: ['packer.js', 'postinstall.js', 'preinstall.js', '.github/workflows/build-release.yml']
  }
) {
  const { includes } = options;
  includes.forEach((downloadPath) => {
    const packer = path.join(process.cwd(), downloadPath);
    if (!fs.existsSync(packer) || options.force) {
      download(
        'https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/main/' + downloadPath,
        path.join(process.cwd(), downloadPath)
      );
    }
  });
}

function download(url, output) {
  axios
    .get(url, { responseType: 'blob' })
    .then((response) => {
      fs.writeFile(output, response.data, (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log('The file has been saved!');
        }
      });
    })
    .catch((e) => console.log(url, e.message));
}

module.exports = setup;
