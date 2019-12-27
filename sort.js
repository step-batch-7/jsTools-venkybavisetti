const fs = require("fs");
const sort = require("./src/sortLib.js").sort;
const { stderr, stdout } = process;

const main = function(cmdLineArgs) {
  const { output, error } = sort(cmdLineArgs, fs);
  stdout.write(output);
  stderr.write(error);
};

main(process.argv.slice(2));
