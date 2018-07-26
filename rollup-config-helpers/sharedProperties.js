/**
 * This script keeps the properties which are shared throughout the created configurations for IIFE and Ecmascript modules
 *
 */
const { join, extname } = require('path');
const settings = require('./settings');
const getOutputPath = require('./getOutputPath');

const environmentSuffix =process.env.BUILD === 'development' ? 'development' : 'production.min';

const paths = {
  react: `${settings.serveModulesFrom}vendor/react.${environmentSuffix}.mjs`,
  'react-dom': `${settings.serveModulesFrom}vendor/react-dom.${environmentSuffix}.mjs`
};
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};
const external = [
  'react',
  'react-dom',
  'https://ecmascriptmodules.com/vendor/react.development.mjs',
  'https://ecmascriptmodules.com/vendor/react-dom.development.mjs',
  'https://ecmascriptmodules.com/vendor/react.production.min.mjs',
  'https://ecmascriptmodules.com/vendor/react-dom.production.min.mjs'
];

function add(m) {
  const n = m.replace(extname(m), '');
  const outputPath = getOutputPath({
    outputPath: join(settings.serveModulesFrom, 'shared'),
    fileName: m
  });

  paths[`shared/${n}`] = outputPath;
  paths[`${n}`] = outputPath;

  globals[n] = `VoIPGRID.shared.${n}`;
  globals[`shared/${n}`] = `VoIPGRID.shared.${n}`;

  external.push(`shared/${n}`);
  external.push(`${n}`);
}

module.exports = { paths, globals, external, add };
