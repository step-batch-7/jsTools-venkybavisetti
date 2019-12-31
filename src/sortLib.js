'use strict';

const parseUserArgs = function(cmdLineArgs) {
  const fileIndex = 0;
  return { fileName: cmdLineArgs[fileIndex] };
};

const generateErrorMsg = function(error) {
  const errorMsg = {
    ENOENT: 'sort: No such file or directory'
  };
  return errorMsg[error.code];
};

const sortOnContent = function(content) {
  const totalLines = content.split('\n');
  return totalLines.sort().join('\n');
};

const sortOnFile = function(error, content, printOutput) {
  console.log(error);
  if (error) {
    const errorLine = generateErrorMsg(error);
    printOutput({ error: errorLine, output: '' });
    return;
  }
  const sortedContent = sortOnContent(content);
  printOutput({ error: '', output: sortedContent });
};

const sortOnStdin = function(stdin, printOutput) {
  stdin.setEncoding('utf8');
  let inputStreamText = '';
  stdin.on('data', data => {
    inputStreamText += data;
  });
  stdin.on('end', () => {
    const sortedContent = sortOnContent(inputStreamText.replace(/\n$/, ''));
    printOutput({ error: '', output: sortedContent });
  });
};

const performSort = function(cmdLineArgs, fileHandlingFunc, printOutput) {
  const parsedSortArgs = parseUserArgs(cmdLineArgs);
  if (!parsedSortArgs.fileName) {
    sortOnStdin(fileHandlingFunc.stdin, printOutput);
  } else {
    fileHandlingFunc.readFile(
      parsedSortArgs.fileName,
      'utf8',
      (error, content) => sortOnFile(error, content, printOutput)
    );
  }
};

module.exports = {
  performSort,
  sortOnFile,
  sortOnContent,
  parseUserArgs,
  generateErrorMsg,
  sortOnStdin
};
