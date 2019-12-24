"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const parsedUserArgs = {
    options: [],
    fileNames: []
  };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] === "-")) parsedUserArgs.fileNames.push(argument);
    else parsedUserArgs.options.push(argument);
  });
  return parsedUserArgs;
};

const loadFileContent = function(userArgs, fileSystem) {
  const fsFileExits = isFileExists.bind(fileSystem);
  if (!userArgs.fileNames.every(fsFileExits)) return { error: fileError() };
  const content = fileSystem.readFile(userArgs.fileNames[0], "utf8");
  return { content };
};

const sortFileOnOptions = function(content, sortOptions) {
  if (!sortOptions.every(isValidOption)) return { error: optionsError() };
  const totalLines = content.split("\n");
  return { output: totalLines.sort().join("\n") };
};

const isValidOption = function(option) {
  const options = [];
  return options.includes(option);
};

const optionsError = function() {
  return "sort: invalid options";
};

const fileError = function() {
  return "sort: No such file or directory";
};

const isFileExists = function(path) {
  return this.existsFile(path);
};

const performSortAction = function(cmdLineArgs, fileSystem) {
  const parsedUserArgs = parseUserArgs(cmdLineArgs);
  let { content, error } = loadFileContent(parsedUserArgs, fileSystem);
  if (error) return { error };
  let sortedFile = sortFileOnOptions(content, parsedUserArgs.options);
  if (sortedFile.error) return { error: sortedFile.error };
  return { output: sortedFile.output };
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  sortFileOnOptions,
  performSortAction,
  fileError
};
