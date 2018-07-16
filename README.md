# frontend-hybrid
Project with the front end applications for the hybrid situation

# General approach
This project uses Rollup to create an EcmaScript module version (.mjs) and a transpiled JavaScript version of modules (.js) from the files in the src/modules and the src/shared directories.
During development it spins up a local webserver to serve these modules so they can be loaded by using ```<script type="module" src="./path-to/some-module.mjs"></script>``` or by using ```import { someThing } from './path-to/some-module.mjs';``` in a native Ecmascript module.

# Development
clone this repo and run ```$ npm i``` to install all dependencies, than run ```$ npm start``` to start development.
