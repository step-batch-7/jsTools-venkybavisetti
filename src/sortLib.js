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
  return { content: fileSystem.readFile(userArgs.fileName[0], "utf8") };
};

const sortFileOnOptions = function(content, sortOptions) {
  const totalLines = content.split("\n");
  return { output: totalLines.sort().join("\n") };
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
  const { output } = sortFileOnOptions(content, parsedUserArgs.options);
  return { output };
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  sortFileOnOptions,
  performSortAction,
  fileError
};
