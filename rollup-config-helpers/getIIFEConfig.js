/**
 * This script is used to create a rollup config for an IIFE version of a module to be used in
 * browsers that to not support either ecmascript modules or the ecmascript module loader functionality
 */
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { extname, basename } = require('path');

const settings = require('./settings');
const { external, globals } = require('./sharedProperties');
const onwarn = require('./onwarn');

module.exports = function getIIFEConfig(filePath, outputDirectory = settings.outputDirectory) {
  const baseName = basename(filePath, extname(filePath));
  const namespace = filePath
    .replace(extname(filePath), '')
    .replace(settings.moduleInputDirectory, '')
    .split('/')
    .filter(v => v)
    .join('.');

  return {
    input: filePath,
    output: {
      file: `${outputDirectory}/${baseName}.js`,
      format: 'iife',
      name: `VoIPGRID.${namespace}`,
      globals
    },
    onwarn,
    external,
    plugins: [
      resolve(),
      babel({
        presets: [
          [
            'env',
            {
              modules: false
            }
          ],
          'react'
        ],
        plugins: ['external-helpers', ['transform-class-properties', { spec: true }]],
        exclude: 'node_modules/**' // only transpile our source code
      }),
      commonjs()
    ],
    watch: false
  };
};
