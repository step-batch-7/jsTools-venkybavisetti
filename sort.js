const { createReadStream } = require('fs');
const performSort = require('./src/sortLib.js').performSort;
const StreamPicker = require('./src/streamPicker.js');
const { stderr, stdout, stdin } = process;

const main = function() {
  const [, , ...cmdLineArgs] = process.argv;
  const printOutput = function(sortResult) {
    stdout.write(sortResult.output);
    stderr.write(sortResult.error);
    if (sortResult.error) {
      process.exitCode = 2;
    }
  };
  const streamPicker = new StreamPicker(createReadStream, stdin);
  performSort(cmdLineArgs, streamPicker, printOutput);
};

main();
