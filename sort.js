const fs = require("fs");
const sort = require("./src/sortLib.js");

const main = function(cmdLineArgs) {
  const config = {
    readFile: fs.readFileSync,
    existsFile: fs.existsSync
  };
  const msg = sort.performanceSortAction(cmdLineArgs, config);
  console.log(msg.output);
  console.error(msg.error);
};

main(process.argv.slice(2));
