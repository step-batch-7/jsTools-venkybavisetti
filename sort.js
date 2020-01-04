const {createReadStream} = require('fs');
const performSort = require('./src/sortLib.js').performSort;
const {stderr, stdout, stdin} = process;

const main = function() {
  const [, , ...cmdLineArgs] = process.argv;
  const printOutput = function(sortResult) {
    stdout.write(sortResult.output);
    stderr.write(sortResult.error);
    if (sortResult.error) {
      process.exitCode = 2;
    }
  };
  performSort(cmdLineArgs, stdin, createReadStream, printOutput);
};

main();
