"use strict";

const parseUserArgs = function(cmdLineArgs) {
  return { fileName: cmdLineArgs[0] };
};

const generateErrorMsg = function(errorType) {
  const errorMsg = {
    fileError: "sort: No such file or directory"
  };
  return errorMsg[errorType];
};

const sortOnContent = function(content) {
  const totalLines = content.split("\n");
  return totalLines.sort().join("\n");
};

const sortOnFile = function(error, content, printOutput) {
  if (error) {
    const error = generateErrorMsg("fileError");
    printOutput({ error, output: "" });
    return;
  }
  const sortedContent = sortOnContent(content);
  printOutput({ error: "", output: sortedContent });
};

const performSort = function(cmdLineArgs, fs, printOutput) {
  const parsedSortArgs = parseUserArgs(cmdLineArgs);
  fs.readFile(parsedSortArgs.fileName, "utf8", (error, content) =>
    sortOnFile(error, content, printOutput)
  );
};

module.exports = {
  performSort,
  sortOnFile,
  sortOnContent,
  parseUserArgs,
  generateErrorMsg
};
