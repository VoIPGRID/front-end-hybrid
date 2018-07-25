const makeDir = require('make-dir');
const cpy = require('cpy');
const replace = require('replace-in-file');
const { join } = require('path');
const { outputDirectory } = require('../rollup-config-helpers/settings');

const reactImport = "import React from 'react';\n";
const ReactExports = `
const {
  Component,
  PureComponent,
  unstable_AsyncComponent,
  Fragment,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  version
} = React;

export default React;
export {
  Component,
  PureComponent,
  unstable_AsyncComponent,
  Fragment,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  version
};`
const ReactDomExports = `
const {
  createPortal,
  findDOMNode,
  hydrate,
  render,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  unstable_createPortal,
  unstable_batchedUpdates,
  unstable_deferredUpdates,
  flushSync
} = ReactDOM;
export default ReactDOM;
export {
  createPortal,
  findDOMNode,
  hydrate,
  render,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  unstable_createPortal,
  unstable_batchedUpdates,
  unstable_deferredUpdates,
  flushSync
};`

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
          from: /'use strict';[^]*\(global\.React = factory\(\)\);\n\}\(this, /m,
          to: 'const React = '
        }).then(() =>
          replace({
            files: join(__dirname, '..', '.temp', 'react.development.mjs'),
            from: /^\}\)\)\);$/m,
            to: `}());${ReactExports}`
          })
        ),

        // react.production.min.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react.production.min.mjs'),
          from: /'use strict';.*define\(h\):p.React=h\(\)\}\)\(this,/m,
          to: 'const React = ('
        }).then(() =>
          replace({
            files: join(__dirname, '..', '.temp', 'react.production.min.mjs'),
            from: /\}\);$\n/m,
            to: `}());${ReactExports}`
          })
        ),

        // react-dom.development.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.development.mjs'),
          from: /^/,
          to: reactImport
        })
          .then(() =>
            replace({
              files: join(__dirname, '..', '.temp', 'react-dom.development.mjs'),
              from: /'use strict';[^]*factory\(global.React\)\);\n\}\(this, /m,
              to: 'const ReactDOM = '
            })
          )
          .then(() =>
            replace({
              files: join(__dirname, '..', '.temp', 'react-dom.development.mjs'),
              from: /^\}\)\)\);$/m,
              to: `}(React));${ReactDomExports}`
            })
          ),

        // react-dom.production.min.mjs
        replace({
          files: join(__dirname, '..', '.temp', 'react-dom.production.min.mjs'),
          from: /^/,
          to: reactImport
        })
          .then(() =>
            replace({
              files: join(__dirname, '..', '.temp', 'react-dom.production.min.mjs'),
              from: /'use strict';[^]*ma\.React\)\}\)\(this,/m,
              to: 'const ReactDOM = ('
            })
          )
          .then(() =>
            replace({
              files: join(__dirname, '..', '.temp', 'react-dom.production.min.mjs'),
              from: /\}\);$/m,
              to: `}(React));${ReactDomExports}`
            })
          )
      ])
    );
};
