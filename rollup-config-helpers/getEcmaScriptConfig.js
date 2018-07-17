const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { extname, basename } = require('path');

const settings = require('./settings');
const { paths, external } = require('./sharedProperties');
const onwarn = require('./onwarn');

module.exports = function getEcmaScriptConfig(
  filePath,
  outputDirectory = settings.outputDirectory
) {
  const baseName = basename(filePath, extname(filePath));

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
      include: filePath,
      clearScreen: false
    }
  };
};
