process.env.BUILD = 'development';

const chalk = require('chalk');
const del = require('del');
const express = require('express');
const rollup = require('rollup');
const { join } = require('path');
const serveStatic = require('serve-static');

const prepareReact = require('./prepareReact');
const getConfiguration = require('../rollup-config-helpers/getConfiguration');
const { outputDirectory } = require('../rollup-config-helpers/settings');
const eventLogger = require('../rollup-config-helpers/eventLogger');

const port = process.env.npm_package_config_port;
const app = express();

// first serve the static files from the directory containing the test-page
app.use(serveStatic(join(__dirname, '..', 'test-page')));
// only log requests for modules and not the tes-page's files
app.use((req, res, next) => {
  console.log(chalk.gray(`[${req.method}] ${req.url}`));
  next();
});
// also server files from the outputDirectory (that's where the modules are copied to)
app.use(serveStatic(join(__dirname, '..', outputDirectory)));

app.listen(port);

console.log(chalk.gray(`started webserver on localhost:${chalk.yellow(port)}`));
console.log(chalk.gray(`process.env.BUILD: ${chalk.yellow(process.env.BUILD)}`));

del([join(__dirname, '..', outputDirectory), join(__dirname, '..', '.temp')])
  .then(dirs => {
    console.log(
      chalk.gray(
        `removed the following directories: ${dirs
          .map(dir => dir.replace(join(__dirname, '..'), ''))
          .join(', ')}`
      )
    );
    console.log(chalk.gray(`Preparing the react and react-dom libraries`));
  })
  .then(prepareReact)
  .then(() => {
    console.log(
      chalk.gray(
        `mjs versions created and copied to the .temp directory, js versions copied to /${outputDirectory}/vendor`
      )
    );
    return getConfiguration();
  })
  .then(o => {
    const watcher = rollup.watch(o);

    console.log(chalk.gray('started rollup watcher'));

    watcher.on('event', eventLogger);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
