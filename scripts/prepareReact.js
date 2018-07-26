/**
 * This script is used by both the dev.js and the prod.js scripts to prepare the react and react-dom
 * NPM modules into ecmascript modules wiht an mjs extension.
 * The UMD versions are being used for that as an input and the UMD wrapper is removed and exports
 * are added.
 *
 * This approach was found to be better than either patching it by hand and having the sources in
 * this repo or building it from the React source ourselves (which proved to be problematic since
 * the internals of React and ReactDOM are frequently changing)
 *
 * Rollup seems to not be able to change the "import from" uri in the react-dom module when the
 * import statement is added by using the output.intro setting so this is a two step process
 *
 */
const makeDir = require('make-dir');
const cpy = require('cpy');
const replace = require('replace-in-file');
const { join } = require('path');
const { outputDirectory, serveModulesFrom } = require('../rollup-config-helpers/settings');
const { reactExports, reactDomExports } = require('./exportedProperties');

const reactExportsString = `
const {${reactExports.join(', ')}} = React;
export default React;
export {${reactExports.join(', ')}};`;

const reactDomExportsString = `
const {${reactDomExports.join(', ')}} = ReactDOM;
export default ReactDOM;
export {${reactDomExports.join(', ')}};`;

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
            join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.development.js'),
            join(__dirname, '..', 'node_modules', 'react', 'umd', 'react.production.min.js'),
            join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.development.js'),
            join(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js')
          ],
          join(__dirname, '..', '.temp'),
          {
            rename: n => n.replace('.js', '.mjs')
          }
        )
      ])
    )
    .then(() =>
      Promise.all([
        // react.development.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react.development.mjs'),
          from: [
            // selects the beginning of the UMD wrapper
            /'use strict';[^]*\(global\.React = factory\(\)\);\n\}\(this, /m,

            // selects the end of the UMD wrapper
            /^\}\)\)\);$/m
          ],
          to: [
            // replacement for the beginning of the UMD wrapper
            'const React = ',

            // replacement for the end of the UMD wrapper
            `}());${reactExportsString}`
          ]
        }),

        // react.production.min.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react.production.min.mjs'),
          from: [
            // selects the beginning of the UMD wrapper
            /'use strict';.*define\(h\):p\.React=h\(\)\}\)\(this,/m,

            // selects the end of the UMD wrapper
            /\}\);$\n/m
          ],
          to: [
            // replacement for the beginning of the UMD wrapper
            'const React = (',

            // replacement for the end of the UMD wrapper
            `}());${reactExportsString}`
          ]
        }),

        // react-dom.development.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.development.mjs'),
          from: [
            // select the beginning of the file
            /^/,

            // selects the beginning of the UMD wrapper
            /'use strict';[^]*factory\(global\.React\)\);\n\}\(this, /m,

            // selects the end of the UMD wrapper
            /^\}\)\)\);$/m
          ],
          to: [
            // add the import react statement at the beginnign of the file
            // 'react' gets rewritten to whatever is set as external in the generated Rollup configuration during development
            // in production scenarios React needs to be imported from their own url's (production.min from produciton.min and development from development)
            `import React from '${
              process.env.BUILD === 'development'
                ? 'react'
                : `${serveModulesFrom}vendor/react.development.mjs`
            }';\n`,

            // replacement for the beginning of the UMD wrapper
            'const ReactDOM = ',

            // replacement for the end of the UMD wrapper
            `}(React));${reactDomExportsString}`
          ]
        }),

        // react-dom.production.min.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.production.min.mjs'),
          from: [
            // select the beginning of the file
            /^/,

            // selects the beginning of the UMD wrapper
            /'use strict';[^]*ma\.React\)\}\)\(this,/m,

            // selects the end of the UMD wrapper
            /\}\);$/m
          ],
          to: [
            // add the import react statement at the beginnign of the file
            // 'react' gets rewritten to whatever is set as external in the generated Rollup configuration during development
            // in production scenarios React needs to be imported from their own url's (production.min from produciton.min and development from development)
            `import React from '${
              process.env.BUILD === 'development'
                ? 'react'
                : `${serveModulesFrom}vendor/react.production.min.mjs`
            }';\n`,

            // replacement for the beginning of the UMD wrapper
            'const ReactDOM = (',

            // replacement for the end of the UMD wrapper
            `}(React));${reactDomExportsString}`
          ]
        })
      ])
    );
};
