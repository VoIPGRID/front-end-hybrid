const { basename, extname } = require('path');

module.exports = function getOutputPath({ fileName, outputPath, isEcmaScript = true }) {
  const extension = isEcmaScript ? '.mjs' : '.js';
  const base = basename(fileName, extname(fileName));

  return `${outputPath}/${base}${extension}`;
}
