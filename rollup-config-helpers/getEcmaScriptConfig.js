/**
 * This script is used to create a rollup config for an ecmascript version of a module
 */
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { extname, basename, join } = require('path');

const settings = require('./settings');
const { paths, external } = require('./sharedProperties');
const onwarn = require('./onwarn');

module.exports = function getEcmaScriptConfig(
  filePath,
  outputDirectory = settings.outputDirectory
) {
  const baseName = basename(filePath, extname(filePath));
  const watchDir = join.apply(null, filePath.split('/').slice(0,2).concat(['**']));

  return {
    input: filePath,
    output: {
      file: `${outputDirectory}/${baseName}.mjs`,
      format: 'es',
      paths
    },
    onwarn,
    external,
    plugins: [
      resolve(),
      babel({
        plugins: [
          'external-helpers',
          'transform-react-jsx',
          ['transform-class-properties', { spec: true }]
        ],
        exclude: 'node_modules/**' // only transpile our source code
      }),
      commonjs()
    ],
    watch: {
      include: watchDir,
      clearScreen: false
    }
  };
};
