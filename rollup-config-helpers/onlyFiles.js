const { excludedFilenames } = require('./settings');

// naive check to filter out folders from the readDirectory output
module.exports = function (directoryContents) {
  return directoryContents.filter(a => a.includes('.') && !excludedFilenames.includes(a));
}
