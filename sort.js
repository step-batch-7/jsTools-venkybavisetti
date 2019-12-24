const fs = require("fs");
const sort = require("./src/sortLib.js").performSortAction;

const main = function(cmdLineArgs) {
  const fileSystem = {
    readFile: fs.readFileSync,
    existsFile: fs.existsSync
  };
  const { output, error } = sort(cmdLineArgs, fileSystem);
  output && process.stdout.write(output);
  error && process.stderr.write(error);
};

main(process.argv.slice(2));
