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
  return totalLines;
};

module.exports = {
  parseUserArgs,
  loadFileContent,
  parseContentOfFile,
  sortFileOnOptions
};
