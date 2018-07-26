const { join } = require('path');

module.exports = {
  moduleInputDirectory: join('src', 'modules'),
  sharedModuleInputDirectory: join('src', 'shared'),
  outputDirectory: join('dist'),

  // exclude these files from the modules and shared modules directories
  excludedFilenames: ['.DS_Store'],

  // root uri which the mddules are served from
  serveModulesFrom: process.env.BUILD === 'development' ? '/' : 'https://modules.voipgrid.nl/'
};
