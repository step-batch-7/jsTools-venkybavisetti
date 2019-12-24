const fs = require("fs");
const sort = require("./src/sortLib.js").performSortAction;

const main = function(cmdLineArgs) {
  const fileHandlingFuncs = fs;
  const { output, error } = sort(cmdLineArgs, fileHandlingFuncs);
  process.stdout.write(output);
  process.stderr.write(error);
};

main(process.argv.slice(2));
