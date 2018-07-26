const chalk = require('chalk');

module.exports = function(err) {
  const {
    code,
    source,
    names,
    message,
    url,
    modules,
    importer,
    ...rest
  } = err;

  delete rest.toString;

  console.log(`${chalk.red('-')} ${chalk.gray('error:')} ${chalk.red(code)}`);
  console.log(`${chalk.gray('message:')} ${chalk.red(message)}`);

  if (names) {
    console.log(`${chalk.gray('imported:')} ${chalk.cyan(names.join(chalk.gray(', ')))}`);
  }

  if (modules) {
    console.log(chalk.gray(`relevant module(s): ${chalk.cyan(modules.join(chalk.gray(', ')))}`));
  }

  if (importer) {
    console.log(chalk.gray(`imported by: ${chalk.cyan(importer)}`));
  }

  if (url) {
    console.log(chalk.gray(`more info: ${chalk.cyan.underline(url)}`));
  }

  if (Object.keys(rest).length) {
    console.log('other info:', rest);
  }
};
