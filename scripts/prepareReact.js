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
const makeDir = require('make-dir');
const cpy = require('cpy');
const replace = require('replace-in-file');
const { join } = require('path');
const { outputDirectory, serveModulesFrom } = require('../rollup-config-helpers/settings');

module.exports = function() {
  return makeDir(join(__dirname, '..', '.temp'))
    .then(() =>
      Promise.all([
        // copy the UMD versions to the vendor directory
        cpy(
          [
            join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.development.js'),
            join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.production.min.js'),
            join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.development.js'),
            join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js')
          ],
          join(__dirname, '..', outputDirectory, 'vendor')
        ),
        // copy the UMD versions to a temp directory so they can be changed into ecmascript modules
        cpy(
          [
            join(__dirname, '..', 'node_modules', 'react-ecmascript', 'react.development.mjs'),
            join(__dirname, '..', 'node_modules', 'react-ecmascript', 'react.production.min.mjs'),
            join(__dirname, '..', 'node_modules', 'react-ecmascript', 'react-dom.development.mjs'),
            join(
              __dirname,
              '..',
              'node_modules',
              'react-ecmascript',
              'react-dom.production.min.mjs'
            )
          ],
          join(__dirname, '..', '.temp')
        )
      ])
    )
    .then(() =>
      Promise.all([

        // react-dom.development.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.development.mjs'),
          from: "import react from 'react;",
          to: `import React from '${
            process.env.BUILD === 'development'
              ? 'react'
              : `${serveModulesFrom}vendor/react.development.mjs`
          }';`
        }),

        // react-dom.production.min.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.production.min.mjs'),
          from: "import react from'react';",
          to: `import React from '${
            process.env.BUILD === 'development'
              ? 'react'
              : `${serveModulesFrom}vendor/react.production.min.mjs`
          }';`
        })
      ])
    );
};
