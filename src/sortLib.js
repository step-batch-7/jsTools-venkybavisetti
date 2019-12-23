const parseUserArgs = function(cmdLineArgs) {
  const requiredArgs = { options: [], fileName: [] };
  cmdLineArgs.forEach(argument => {
    if (!(argument[0] == "-")) requiredArgs.fileName.push(argument);
    if (argument[0] == "-") requiredArgs.options.push(argument);
  });
  return requiredArgs;
};

module.exports = { parseUserArgs };
