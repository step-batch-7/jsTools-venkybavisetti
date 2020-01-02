'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const sort = require('../src/sortLib.js');

describe('parseUserArgs', function() {
  it('should separate options and fileName', function() {
    const cmdLineArgs = ['one.txt'];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = {
      fileName: 'one.txt'
    };
    assert.deepStrictEqual(actual, expected);
  });
});

// describe('sortOnFile', function() {
//   it('should give sorted file when there is no error', function() {
//     const error = false;
//     const content = 'b\na\nc';
//     const printOutput = sinon.spy();
//     sort.sortOnFile(error, content, printOutput);
//     assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
//   });
//   it('should give file error when the error argument is given', function() {
//     const error = { code: 'ENOENT' };
//     const content = undefined;
//     const printOutput = sinon.spy();
//     sort.sortOnFile(error, content, printOutput);
//     assert.isTrue(
//       printOutput.calledWith({
//         error: 'sort: No such file or directory',
//         output: ''
//       })
//     );
//   });
//   it('should give directory error when directory is given as file', function() {
//     const error = { code: 'EISDIR' };
//     const content = undefined;
//     const printOutput = sinon.spy();
//     sort.sortOnFile(error, content, printOutput);
//     assert.isTrue(
//       printOutput.calledWith({
//         error: 'sort: Is a directory',
//         output: ''
//       })
//     );
//   });
//   it('should give permission error when the file can not have access', () => {
//     const error = { code: 'EACCES' };
//     const content = undefined;
//     const printOutput = sinon.spy();
//     sort.sortOnFile(error, content, printOutput);
//     assert.isTrue(
//       printOutput.calledWith({
//         error: 'sort: Permission denied',
//         output: ''
//       })
//     );
//   });
// });

// describe('sortOnStdin', function() {
//   it('should take content from the stdin and sort the content', () => {
//     const stdin = { setEncoding: sinon.fake(), on: sinon.fake() };
//     const printOutput = sinon.spy();
//     sort.sortOnStdin(stdin, printOutput);
//     assert(stdin.setEncoding.calledWith('utf8'));
//     assert.strictEqual(stdin.on.firstCall.args[0], 'data');
//     stdin.on.firstCall.args[1]('c\nb\na\n');
//     assert.strictEqual(stdin.on.secondCall.args[0], 'end');
//     assert.strictEqual(stdin.on.callCount, 2);
//     stdin.on.secondCall.args[1]();
//     assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
//   });
// });

describe('sortOnContent', function() {
  it('should sort the file based on the content', function() {
    const content = 'bcd\ncde\nabc';
    const actual = sort.sortOnContent(content);
    const expected = 'abc\nbcd\ncde';
    assert.deepStrictEqual(actual, expected);
  });
  it('should sort the file when file is empty', function() {
    const content = '';
    const actual = sort.sortOnContent(content);
    const expected = '';
    assert.deepStrictEqual(actual, expected);
  });
});

describe('performSort', function() {
  it('should sort on  readFile when there is no error', done => {
    const argv = ['somePath'];
    const printOutput = sinon.spy(done());
    const callback = sinon.fake.yieldsAsync(null, 'a\nc\nb');
    const fileHandlingFun = { readFile: callback };
    sort.performSort(argv, fileHandlingFun, printOutput);
    assert(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
    const expected = ['somePath', 'utf8'];
    const [filePath, encoding] = callback.firstCall.args;
    assert.deepStrictEqual([filePath, encoding], expected);
  });
  it('should sort on  stdin when there is no fileName', () => {
    const argv = [];
    const printOutput = sinon.spy();
    const fileHandlingFun = {
      stdin: { setEncoding: sinon.fake(), on: sinon.fake() }
    };
    sort.performSort(argv, fileHandlingFun, printOutput);
    assert(fileHandlingFun.stdin.setEncoding.calledWith('utf8'));
    assert.strictEqual(fileHandlingFun.stdin.on.firstCall.args[0], 'data');
    fileHandlingFun.stdin.on.firstCall.args[1]('c\nb\na\n');
    assert.strictEqual(fileHandlingFun.stdin.on.secondCall.args[0], 'error');
    assert.strictEqual(fileHandlingFun.stdin.on.thirdCall.args[0], 'end');
    assert.strictEqual(fileHandlingFun.stdin.on.callCount, 3);
    fileHandlingFun.stdin.on.thirdCall.args[1]();
    assert(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });

  it('should give file error when file is not present', done => {
    const argv = ['somePath'];
    const printOutput = sinon.spy(done());
    const callback = sinon.fake.yieldsAsync(true, undefined);
    const fs = { readFile: callback };
    sort.performSort(argv, fs, printOutput);
    assert.isTrue(
      printOutput.calledWith({
        error: 'sort: No such file or directory',
        output: ''
      })
    );
  });
});

describe('generateErrorMsg', function() {
  it('should get file error', function() {
    const actual = sort.generateErrorMsg({ code: 'ENOENT' });
    const expected = 'sort: No such file or directory';
    assert.strictEqual(actual, expected);
  });
});
