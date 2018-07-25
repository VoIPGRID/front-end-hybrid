/*
  This file exports a function which returns a Promise for a Rollup config

  the reason that it's a asynchronous is that it reads two folders to see what files are
  in them and creates relevant configurations for them so they get outputted as a module

*/
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const { readdir } = require('fs');
const { promisify } = require('util');
const { join } = require('path');

const getIIFEConfig = require('./getIIFEConfig');
const getEcmaScriptConfig = require('./getEcmaScriptConfig');
const onlyFiles = require('./onlyFiles');

const settings = require('./settings');
const { paths, external, globals } = require('./sharedProperties');
const sharedProperties = require('./sharedProperties');
const onwarn = require('./onwarn');

const readDirectory = promisify(readdir);

// settings for the react libs which always need to be parsed by Rollup
// since the react-dom script needs react and imports it and it needs a
// path to load it from
const outputDefault = [
  {
  input: [
    // `src/vendor/react.development-${settings.reactVersion}.mjs`,
    // `src/vendor/react-dom.development-${settings.reactVersion}.mjs`,
    // `src/vendor/react-${settings.reactVersion}.mjs`,
    // `src/vendor/react-dom-${settings.reactVersion}.mjs`
    `.temp/react.development.mjs`,
    `.temp/react-dom.development.mjs`,
    `.temp/react.production.min.mjs`,
    `.temp/react-dom.production.min.mjs`
  ],
  experimentalCodeSplitting: true,
  output: {
    dir: join(settings.outputDirectory, 'vendor'),
    entryFileNames: '[name].mjs',
    format: 'es',
    paths
  },
  onwarn,
  external,
  plugins: [resolve(), commonjs()],
  watch: false
}
];

module.exports = function() {
  const allConfigurationsPromise = Promise.all([
    readDirectory(join(__dirname, '..', settings.moduleInputDirectory)).then(onlyFiles),
    readDirectory(join(__dirname, '..', settings.sharedModuleInputDirectory)).then(onlyFiles)
  ]).then(([baseModules, sharedModules]) => {
    sharedModules.forEach(sharedProperties.add);

    const allConfigurations = outputDefault
      .concat(baseModules.map(f => getEcmaScriptConfig(join(settings.moduleInputDirectory, f))))
      .concat(
        sharedModules.map(f =>
          getEcmaScriptConfig(
            join(settings.sharedModuleInputDirectory, f),
            join(settings.outputDirectory, 'shared')
          )
        )
      )
      .concat(baseModules.map(f => getIIFEConfig(join(settings.moduleInputDirectory, f))))
      .concat(
        sharedModules.map(f =>
          getIIFEConfig(
            join(settings.sharedModuleInputDirectory, f),
            join(settings.outputDirectory, 'shared')
          )
        )
      );

    return allConfigurations;
  });

  return allConfigurationsPromise;
};
