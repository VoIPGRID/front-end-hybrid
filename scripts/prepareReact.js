/**
 * This script is used by copy the published UMD version of the react and react-dom packages to the dist directory
 * and to copy the ecmascript versions fromthe react-ecmascript NPM module.
 * To enable switching from the development version to the production.min version of both react and react-dom
 * the import url is replaced here, since Rollup only is aware of one version at a time and we have 2 files
 * that need to point to their own version of react (either production,min or development)
 *
 * Rollup doesn't change the "import from" uri in the react-dom module when the
 * import statement is added by using the output.intro setting so this is a two step process
 *
 */
const fs = require('fs');
const { promisify } = require('util');
const makeDir = require('make-dir');
const cpy = require('cpy');
const reactEcmascript = require('react-ecmascript');
const { join } = require('path');
const { outputDirectory, serveModulesFrom } = require('../rollup-config-helpers/settings');

const write = promisify(fs.writeFile);

module.exports = function() {
  return makeDir(join(__dirname, '..', '.temp'))
    .then(() =>
      cpy(
        [
          join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.development.js'),
          join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.production.min.js'),
          join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.development.js'),
          join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js')
        ],
        join(__dirname, '..', outputDirectory, 'vendor')
      )
    )
    .then(() => {
      const loadReactFrom =
        process.env.BUILD === 'development' ? undefined : `${serveModulesFrom}vendor/`;

      return reactEcmascript(loadReactFrom);
    })
    .then(reactSources =>
      Object.keys(reactSources).map(filename =>
        write(join(__dirname, '..', '.temp', filename), reactSources[filename], 'utf8')
      )
    );
};
