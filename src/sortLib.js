"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const parsedUserArgs = {
    options: [],
    fileName: []
  };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] === "-")) parsedUserArgs.fileName.push(argument);
    else parsedUserArgs.options.push(argument);
  });
  return parsedUserArgs;
};

const loadFileContent = function(userArgs, fileSystem) {
  const fsFileExits = isFileExists.bind(fileSystem);
  if (!userArgs.fileName.every(fsFileExits)) return { error: fileError() };
  const content = fileSystem.readFile(userArgs.fileName[0], "utf8");
  return { content };
};

const sortFileOnOptions = function(content, sortOptions) {
  if (!sortOptions.every(isValidOption))
    return { error: "sort: invalid options" };
  const totalLines = content.split("\n");
  return { output: totalLines.sort().join("\n") };
};

const isValidOption = function(option) {
  const options = [];
  options.includes(option);
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
