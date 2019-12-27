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

const loadFileContent = function(userArgs, fs) {
  const fsFileExits = isFileExists.bind(fs);
  if (!userArgs.fileNames.every(fsFileExits)) {
    return { error: generateErrorMsg("fileError") };
  }
  const content = fs.readFileSync(userArgs.fileNames[0], "utf8");
  return { content };
};

const sortFileOnOptions = function(content, sortOptions) {
  if (!(sortOptions.length == 0)) {
    return { error: generateErrorMsg("optionError") };
  }
  const totalLines = content.split("\n");
  return { output: totalLines.sort().join("\n") };
};

const generateErrorMsg = function(errorType) {
  const errorMsg = {
    optionError: "sort: invalid options",
    fileError: "sort: No such file or directory"
  };
  return errorMsg[errorType];
};

const isFileExists = function(path) {
  return this.existsSync(path);
};

const performSort = function(cmdLineArgs, fs) {
  const parsedSortArgs = parseUserArgs(cmdLineArgs);
  let fileContent = loadFileContent(parsedSortArgs, fs);
  if (fileContent.error) {
    return { error: fileContent.error, output: String() };
  }

  let sortedContent = sortFileOnOptions(fileContent.content, parsedSortArgs.options);
  if (sortedContent.error) {
    return { error: sortedContent.error, output: String() };
  }

  return { output: sortedContent.output, error: String() };
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  sortFileOnOptions,
  performSort
};
