const fs = require("fs");
const performSort = require("./src/sortLib.js").performSort;
const { stderr, stdout } = process;

const main = function(cmdLineArgs) {
  const { output, error } = performSort(cmdLineArgs, fs);
  stdout.write(output);
  stderr.write(error);
};

main(process.argv.slice(2));
