const { join } = require('path');
const port = process.env.npm_package_config_port;

module.exports = {
  reactVersion:  '16.4.1',
  moduleInputDirectory: join('src', 'modules'),
  sharedModuleInputDirectory: join('src', 'shared'),
  outputDirectory: join('dist'),

  // exclude these files from the modules and shared modules directories
  excludedFilenames: ['.DS_Store'],

  // root uri which the mddules are served from
  serveModulesFrom: process.env.BUILD === 'development' ? '/' : 'https://modules.voipgrid.nl/'
};
