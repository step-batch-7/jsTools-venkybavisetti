"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const parsedUserArgs = {
    options: [],
    fileName: [],
    msg: { output: "", error: "" }
  };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] === "-")) parsedUserArgs.fileName.push(argument);
    else parsedUserArgs.options.push(argument);
  });
  return parsedUserArgs;
};

const loadFileContent = function(userArgs, fileSystem) {
  return fileSystem.readFile(userArgs.fileName[0], "utf8");
};

const parseContentOfFile = function(content) {
  return content.split("\n");
};

const sortFileOnOptions = function(totalLines, sortOptions) {
  return totalLines.sort().join("\n");
};

const fileError = function() {
  return "sort: No such file or directory";
};

const performSortAction = function(cmdLineArgs, fileSystem) {
  const parsedUserArgs = parseUserArgs(cmdLineArgs);
  if (!fileSystem.existsFile(parsedUserArgs.fileName[0])) {
    parsedUserArgs.msg.error = fileError();
    return parsedUserArgs.msg;
  }
  const content = loadFileContent(parsedUserArgs, fileSystem);
  const totalLines = parseContentOfFile(content);
  parsedUserArgs.msg.output = sortFileOnOptions(
    totalLines,
    parsedUserArgs.options
  );
  return parsedUserArgs.msg;
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  parseContentOfFile,
  sortFileOnOptions,
  performSortAction,
  fileError
};
