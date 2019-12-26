const fs = require("fs");
const sort = require("./src/sortLib.js").performSortAction;
const { stderr, stdout, stdin } = process;

const main = function(cmdLineArgs) {
  const fileHandlingFuncs = fs;
  const { output, error } = sort(cmdLineArgs, fileHandlingFuncs, stdin);
  stdout.write(output);
  stderr.write(error);
};

main(process.argv.slice(2));
