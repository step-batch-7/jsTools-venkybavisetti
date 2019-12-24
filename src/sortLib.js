"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const parsedSortArgs = {
    options: [],
    fileNames: []
  };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] === "-")) parsedSortArgs.fileNames.push(argument);
    else parsedSortArgs.options.push(argument);
  });
  return parsedSortArgs;
};

const loadFileContent = function(userArgs, fileHandlingFuncs) {
  const fsFileExits = isFileExists.bind(fileHandlingFuncs);
  if (!userArgs.fileNames.every(fsFileExits)) return { fileError: fileError() };
  const content = fileHandlingFuncs.readFileSync(userArgs.fileNames[0], "utf8");
  return { content };
};

const sortFileOnOptions = function(content, sortOptions) {
  if (!sortOptions.every(isValidOption)) return { optionError: optionError() };
  const totalLines = content.split("\n");
  return { output: totalLines.sort().join("\n") };
};

const isValidOption = function(option) {
  const options = [];
  return options.includes(option);
};

const optionError = function() {
  return "sort: invalid options";
};

const fileError = function() {
  return "sort: No such file or directory";
};

const isFileExists = function(path) {
  return this.existsSync(path);
};

const performSortAction = function(cmdLineArgs, fileHandlingFuncs) {
  const parsedSortArgs = parseUserArgs(cmdLineArgs);
  let { content, fileError } = loadFileContent(parsedSortArgs, fileHandlingFuncs);
  if (fileError) return { error: fileError, output: String() };
  let { output, optionError } = sortFileOnOptions(content, parsedSortArgs.options);
  if (optionError) return { error: optionError, output: String() };
  return { output, error: String() };
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  sortFileOnOptions,
  performSortAction,
  fileError
};
