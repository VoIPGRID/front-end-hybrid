const chalk = require('chalk');
const { join } = require('path');

const srcAndSlashRegExp = /(^src\/|\/)/g;
const startSlashRegExp = /^\//;
const baseDirectory = join(__dirname, '..');
function sanitize(thing) {
  if (Array.isArray(thing)) {
    return thing.map(sanitize).join(chalk.gray(' and\n  '));
  } else {
    return thing
      .replace(baseDirectory, '')
      .replace(startSlashRegExp, '')
      .replace(srcAndSlashRegExp, chalk.grey('$&'));
  }
}

module.exports = e => {
  switch (e.code) {
    case 'BUNDLE_END':
      console.log(
        chalk.gray(
          `${chalk.green('-')} ${chalk.white(sanitize(e.input))} --> ${chalk.white(
            sanitize(e.output)
          )}`
        )
      );
      break;

    case 'END':
      console.log(`${chalk.green('-')} ${chalk.gray('finished building all modules')}`);
      break;

    case 'ERROR':
      const {
        error: { code, message, stack }
      } = e;
      console.log(`${chalk.red('-')} ${chalk.gray('error:')} ${chalk.red(code)}`);
      console.log(`${chalk.gray('message:')} ${chalk.red(message)}`);
      console.log(chalk.cyan(e.error.stack));
      break;

    case 'FATAL':
      console.log(chalk.red(e.error.message));
      console.log(e.error.stack);
      console.log(chalk.yellow('encountered fatal error, exiting process...'));
      process.exit(1);
  }
};
