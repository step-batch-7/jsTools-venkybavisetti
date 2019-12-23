const fs = require("fs");
const sort = require("./src/sortLib.js").performSortAction;

const main = function(cmdLineArgs) {
  const config = {
    readFile: fs.readFileSync,
    existsFile: fs.existsSync
  };
  const msg = sort(cmdLineArgs, config);
  process.stdout.write(msg.output);
  process.stderr.write(msg.error);
};

main(process.argv.slice(2));
