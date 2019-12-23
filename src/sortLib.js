const parseUserArgs = function(cmdLineArgs) {
  const requiredArgs = { options: [] };
  cmdLineArgs.forEach(argument => {
    if (argument[0] == "-") requiredArgs.options.push(argument);
    requiredArgs.fileName = argument;
  });
  return requiredArgs;
};

module.exports = { parseUserArgs };
