const fs = require("fs");
const performSort = require("./src/sortLib.js").performSort;
const { stderr, stdout } = process;

const main = function(cmdLineArgs) {
  const printOutput = function(sortResult) {
    stdout.write(sortResult.output);
    stderr.write(sortResult.error);
  };
  performSort(cmdLineArgs, fs, printOutput);
};

main(process.argv.slice(2));
