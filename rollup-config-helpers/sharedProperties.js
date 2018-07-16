const { join, extname } = require('path');
const settings = require('./settings');
const getOutputPath = require('./getOutputPath');

const paths = {
  react: `/vendor/react.development-${settings.reactVersion}.mjs`,
  'react-dom': `/vendor/react-dom.development-${settings.reactVersion}.mjs`
};
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};
const external = ['react', 'react-dom'];

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
