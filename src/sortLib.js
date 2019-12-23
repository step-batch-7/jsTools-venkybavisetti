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

module.exports = { parseUserArgs, loadFileContent, parseContentOfFile };
