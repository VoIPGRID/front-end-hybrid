process.env.BUILD = 'production';

const cpy = require('cpy');
const chalk = require('chalk');
const del = require('del');
const rollup = require('rollup');
const { join } = require('path');

const getConfiguration = require('../rollup-config-helpers/getConfiguration');
const { outputDirectory } = require('../rollup-config-helpers/settings');

// taken from the documentation at https://rollupjs.org/guide/en#inputoptions
const inputOptions = [
  'input', // the only required option
  'external',
  'plugins',

  // advanced options
  'onwarn',
  'cache',
  'perf',

  // danger zone
  'acorn',
  'acornInjectPlugins',
  'treeshake',
  'context',
  'moduleContext',

  // experimental
  'experimentalCodeSplitting',
  'manualChunks',
  'optimizeChunks',
  'chunkGroupingSize'
];
// taken from the documentation at https://rollupjs.org/guide/en#outputoptions
const outputOptions = [
  'format', // required
  'file',
  'dir',
  'name',
  'globals',

  // advanced options
  'paths',
  'banner',
  'footer',
  'intro',
  'outro',
  'sourcemap',
  'sourcemapFile',
  'interop',
  'extend',

  // danger zone
  'exports',
  'amd',
  'indent',
  'strict',
  'freeze',
  'legacy',
  'namespaceToStringTag',

  // experimental
  'entryFileNames',
  'chunkFileNames',
  'assetFileNames'
];

function convertConfigs(configs) {
  const convertedConfigs = [];

  configs.forEach(config => {
    function addToConfig(prev, cur) {
      if (cur in config) {
        prev[cur] = config[cur];
      }
      return prev;
    }
    convertedConfigs.push([
      inputOptions.reduce(addToConfig, {}),
      outputOptions.reduce(addToConfig, Object.assign({}, config.output))
    ]);
  });

  return convertedConfigs;
}

console.log(chalk.gray(`process.env.BUILD: ${chalk.yellow(process.env.BUILD)}`));

del([join(__dirname, '..', outputDirectory, '*')])
  .then(() => {
    console.log(chalk.gray(`removed the contents of the /${outputDirectory} directory`));
    return getConfiguration();
  })
  .then(convertConfigs)
  .then(convertedConfigs => {
    return Promise.all(
      convertedConfigs.map(([inputOptions, outputOptions]) =>
        rollup
          .rollup(inputOptions)
          .then(bundle => bundle.generate(outputOptions).then(() => bundle.write(outputOptions)))
      )
    );
  })
  .then(() => {
    console.log(chalk.green('finished rollup build'));

    return cpy([join(__dirname, '..', 'netlify.config', '*')], join(__dirname, '..', outputDirectory));
  })
  .catch(console.error);
