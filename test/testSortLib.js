'use strict';

const {assert} = require('chai');
const {spy} = require('sinon');
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
  let fileStream, stdin, readStream;
  beforeEach(function() {
    fileStream = {on: spy(), setEncoding: spy()};
    stdin = {on: spy(), setEncoding: spy()};
    readStream = () => fileStream;
  });
  context('content is read by readStream', function() {
    afterEach(function() {
      assert.strictEqual(fileStream.on.firstCall.args[0], 'data');
      assert.strictEqual(fileStream.on.secondCall.args[0], 'error');
      assert.strictEqual(fileStream.on.thirdCall.args[0], 'end');
      assert(fileStream.setEncoding.calledWith('utf8'));
    });
    it('should sort on  file when there is no error', () => {
      const argv = ['somePath'];
      const printOutput = spy();
      sort.performSort(argv, stdin, readStream, printOutput);
      fileStream.on.firstCall.args[1]('c\nb\na\n');
      assert.strictEqual(fileStream.on.callCount, 3);
      fileStream.on.thirdCall.args[1]();
      assert(printOutput.calledWith({error: '', output: 'a\nb\nc'}));
    });

    it('should give file error when file is not present', () => {
      const argv = ['somePath'];
      const printOutput = spy();
      sort.performSort(argv, stdin, readStream, printOutput);
      assert.strictEqual(fileStream.on.callCount, 3);
      fileStream.on.secondCall.args[1]({code: 'ENOENT'});
      assert(
        printOutput.calledWith({
          error: 'sort: No such file or directory',
          output: ''
        })
      );
    });
  });
  context('content is read by stdin', function() {
    it('should sort on  stdin when there is no fileName', () => {
      const argv = [];
      const printOutput = spy();
      sort.performSort(argv, stdin, readStream, printOutput);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.firstCall.args[0], 'data');
      assert.strictEqual(stdin.on.secondCall.args[0], 'error');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.firstCall.args[1]('c\n');
      stdin.on.firstCall.args[1]('a\n');
      stdin.on.firstCall.args[1]('b\n');
      assert.strictEqual(stdin.on.callCount, 3);
      stdin.on.thirdCall.args[1]();
      assert(printOutput.calledWith({error: '', output: 'a\nb\nc'}));
    });
  });
});

describe('generateErrorMsg', function() {
  it('should give file error', function() {
    const actual = sort.generateErrorMsg({code: 'ENOENT'});
    const expected = 'sort: No such file or directory';
    assert.strictEqual(actual, expected);
  });
  it('should give directory error', function() {
    const actual = sort.generateErrorMsg({code: 'EISDIR'});
    const expected = 'sort: Is a directory';
    assert.strictEqual(actual, expected);
  });
  it('should give permission error', function() {
    const actual = sort.generateErrorMsg({code: 'EACCES'});
    const expected = 'sort: Permission denied';
    assert.strictEqual(actual, expected);
  });
});
