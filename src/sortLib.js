"use strict";

const parseUserArgs = function(cmdLineArgs) {
  const requiredArgs = {
    options: [],
    fileName: [],
    msg: { output: "", error: "" }
  };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] === "-")) requiredArgs.fileName.push(argument);
    else requiredArgs.options.push(argument);
  });
  return requiredArgs;
};

const loadFileContent = function(userArgs, config) {
  return config.readFile(userArgs.fileName[0], "utf8");
};

const parseContentOfFile = function(content) {
  return content.split("\n");
};

const sortFileOnOptions = function(totalLines, sortOptions) {
  return totalLines.sort();
};

const fileError = function() {
  return "sort: No such file or directory";
};

const performanceSortAction = function(cmdLineArgs, config) {
  const userArgs = parseUserArgs(cmdLineArgs);
  if (!config.existsFile(userArgs.fileName[0])) {
    userArgs.msg.error = fileError();
    return userArgs.msg;
  }
  const content = loadFileContent(userArgs, config);
  const totalLines = parseContentOfFile(content);
  userArgs.msg.output = sortFileOnOptions(totalLines, userArgs.options).join(
    "\n"
  );
  return userArgs.msg;
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  parseContentOfFile,
  sortFileOnOptions,
  performanceSortAction,
  fileError
};
