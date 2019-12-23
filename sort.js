const fs = require("fs");
const sort = require("./src/sortLib.js");

const main = function(cmdLineArgs) {
  const config = {
    readFile: fs.readFileSync,
    existsFile: fs.existsSync
  };
  console.log(sort.performanceSortAction(cmdLineArgs, config));
};

main(process.argv.slice(2));
