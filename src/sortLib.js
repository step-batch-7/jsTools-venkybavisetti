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

const performSort = function(cmdLineArgs, streams, printOutput) {
  const { stdin, createReadStream } = streams;
  const { fileName } = parseUserArgs(cmdLineArgs);
  const inputStream = fileName ? createReadStream(fileName) : stdin;
  let inputContent = '';
  inputStream.setEncoding('utf8');

  inputStream.on('data', data => {
    inputContent += data;
  });
  inputStream.on('error', error =>
    printOutput({ error: generateErrorMsg(error), output: '' })
  );
  inputStream.on('end', () => {
    const sortedContent = sortOnContent(inputContent.replace(/\n$/, ''));
    printOutput({ error: '', output: sortedContent });
  });
};

module.exports = {
  performSort,
  sortOnContent,
  parseUserArgs,
  generateErrorMsg
};
