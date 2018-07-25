# frontend-hybrid
Project with the front end applications for the VoIPGRID hybrid scenario.

# General approach
This project uses Rollup to create an Ecmascript module version (.mjs) and a transpiled JavaScript version of modules (.js) from the files in the src/modules and the src/shared directories.
During development it spins up a local webserver to serve these modules so they can be loaded by using ```<script type="module" src="./path-to/some-module.mjs"></script>``` or by using ```import { someThing } from './path-to/some-module.mjs';``` in a native Ecmascript module.

At the moment this project uses an automatically patched version of the UMD versions of the react and the react-dom libraries in NPM. It adds ```export```'s and ```import```s so they can be loaded as Ecmascript modules. The prepareReact.js script in /scripts  removes the UMD part, and it stores the return value of the factory function inside a local ```const React;``` or ```const ReactDOM;``` which are later exported together with their properties. The resulting *.mjs versions are later parsed by Rollup so the ```import``` uri can be changed. And they're parsed into the /dist/vendor directory so they can be loaded and ```import```ed by a browser.

# Development
clone this repo and run ```$ npm i``` to install all dependencies, than run ```$ npm start``` to start development.

# Important notes
Since native Ecmascript modules are the basis of this project the .mjs extension is used. This makes it easy to differentiate the intention by only looking at the files name. And it enables us to output an Ecmascript module (.mjs) and a normal script file (.js) in the same directory.
Also a mix of ways to formulate ```import``` is needed. Mainly so that Rollup can modify the ```import```s so they point to URI's. For instance to ```import``` a shared module you need to use ```import { someVar } from 'shared/someModule';``` since those module identifiers get transformed by Rollup. ```imports``` which look like URI's will not get translated by Rollup (and they need to be). The rule of thumb is: if a module should be bundled into the ```import```ing module use (relative) URI's or paths, and if a module should be considered external and bundled seperately use the module identifier. This resembles the syntax used when importing native/NPM modules. Do not worry Rollup interpets the code of modules in this project first so modules know to this project will not resolve to native modules or ones from NPM.

# todo
combine the built sources in a shared.js file (so those modules can be loaded in one go if no native Ecmascript module support) and minify built sources in ```process.env.BUILD === 'production'``` scenarios.
Add ESLint and Prettier and git hooks.
