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

module.exports = { parseUserArgs, loadFileContent };
