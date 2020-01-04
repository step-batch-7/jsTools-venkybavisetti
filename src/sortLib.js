const parseUserArgs = function(cmdLineArgs) {
  const [fileName] = cmdLineArgs;
  return {fileName};
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

const performSort = function(cmdLineArgs, streamPicker, printOutput) {
  const {fileName} = parseUserArgs(cmdLineArgs);
  const inputStream = streamPicker.pick(fileName);
  inputStream.setEncoding('utf8');
  let inputContent = '';

  inputStream.on('data', data => {
    inputContent += data;
  });
  inputStream.on('error', error =>
    printOutput({error: generateErrorMsg(error), output: ''})
  );
  inputStream.on('end', () => {
    const sortedContent = sortOnContent(inputContent.replace(/\n$/, ''));
    printOutput({error: '', output: sortedContent});
  });
};

module.exports = {
  performSort,
  sortOnContent,
  parseUserArgs,
  generateErrorMsg
};
