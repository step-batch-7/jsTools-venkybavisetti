'use strict';

const parseUserArgs = function(cmdLineArgs) {
  const fileIndex = 0;
  return { fileName: cmdLineArgs[fileIndex] };
};

const generateErrorMsg = function(error) {
  const errorMsg = {
    EISDIR: 'sort: Is a directory',
    ENOENT: 'sort: No such file or directory',
    EACCES: 'sort: Permission denied'
  };
  return errorMsg[error.code];
};

const sortOnContent = function(content) {
  const totalLines = content.split('\n');
  return totalLines.sort().join('\n');
};

const sortOnFile = function(error, content, onComplete) {
  if (error) {
    const errorLine = generateErrorMsg(error);
    onComplete({ error: errorLine, output: '' });
    return;
  }
  const sortedContent = sortOnContent(content);
  onComplete({ error: '', output: sortedContent });
};

const sortOnStdin = function(stdin, onComplete) {
  stdin.setEncoding('utf8');
  let inputStreamText = '';
  stdin.on('data', data => {
    inputStreamText += data;
  });
  stdin.on('end', () => {
    const sortedContent = sortOnContent(inputStreamText.replace(/\n$/, ''));
    onComplete({ error: '', output: sortedContent });
  });
};

const performSort = function(cmdLineArgs, fileHandlingFunc, printOutput) {
  const { stdin, readFile } = fileHandlingFunc;
  const { fileName } = parseUserArgs(cmdLineArgs);
  if (fileName) {
    readFile(fileName, 'utf8', (error, content) =>
      sortOnFile(error, content, printOutput)
    );
  } else {
    sortOnStdin(stdin, printOutput);
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
