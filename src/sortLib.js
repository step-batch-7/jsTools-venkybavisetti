"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const requiredArgs = { options: [], fileName: [] };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] == "-")) requiredArgs.fileName.push(argument);
    else requiredArgs.options.push(argument);
  });
  return requiredArgs;
};

const loadFileContent = function(path, read) {
  return read(path, "utf8");
};

const parseContentOfFile = function(content) {
  return content.split("\n");
};

const sortFileOnOptions = function(totalLines, options) {
  if (options.includes("-n")) totalLines.sort((a, b) => a - b);
  else totalLines.sort();
  return totalLines.slice(2);
};

const performanceSortAction = function(cmdLineArgs, config) {
  const userArgs = parseUserArgs(cmdLineArgs);
  if (!config.existsFile(userArgs.fileName[0])) return "file not found";
  const content = loadFileContent(userArgs.fileName[0], config.readFile);
  const totalLines = parseContentOfFile(content);
  return sortFileOnOptions(totalLines, userArgs.options).join("\n");
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  parseContentOfFile,
  sortFileOnOptions,
  performanceSortAction
};
