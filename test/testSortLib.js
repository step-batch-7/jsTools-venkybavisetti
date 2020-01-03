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
  let stream, streamPicker;
  beforeEach(function() {
    stream = { setEncoding: sinon.fake(), on: sinon.fake() };
    streamPicker = { pick: sinon.fake.returns(stream) };
  });

  afterEach(function() {
    assert.strictEqual(stream.on.firstCall.args[0], 'data');
    assert.strictEqual(stream.on.secondCall.args[0], 'error');
    assert.strictEqual(stream.on.thirdCall.args[0], 'end');
  });

  it('should sort on  file when there is no error', () => {
    const argv = ['somePath'];
    const printOutput = sinon.spy();
    sort.performSort(argv, streamPicker, printOutput);
    stream.on.firstCall.args[1]('c\nb\na\n');
    assert.strictEqual(stream.on.callCount, 3);
    stream.on.thirdCall.args[1]();
    assert(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });

  it('should sort on  stdin when there is no fileName', () => {
    const argv = [];
    const printOutput = sinon.spy();
    sort.performSort(argv, streamPicker, printOutput);
    assert(stream.setEncoding.calledWith('utf8'));
    stream.on.firstCall.args[1]('c\n');
    stream.on.firstCall.args[1]('a\n');
    stream.on.firstCall.args[1]('b\n');
    assert.strictEqual(stream.on.callCount, 3);
    stream.on.thirdCall.args[1]();
    assert(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });

  it('should give file error when file is not present', () => {
    const argv = ['somePath'];
    const printOutput = sinon.spy();
    sort.performSort(argv, streamPicker, printOutput);
    assert(stream.setEncoding.calledWith('utf8'));
    assert.strictEqual(stream.on.callCount, 3);
    stream.on.secondCall.args[1]({ code: 'ENOENT' });
    assert(
      printOutput.calledWith({
        error: 'sort: No such file or directory',
        output: ''
      })
    );
  });
});

describe('generateErrorMsg', function() {
  it('should give file error', function() {
    const actual = sort.generateErrorMsg({ code: 'ENOENT' });
    const expected = 'sort: No such file or directory';
    assert.strictEqual(actual, expected);
  });
  it('should give directory error', function() {
    const actual = sort.generateErrorMsg({ code: 'EISDIR' });
    const expected = 'sort: Is a directory';
    assert.strictEqual(actual, expected);
  });
  it('should give permission error', function() {
    const actual = sort.generateErrorMsg({ code: 'EACCES' });
    const expected = 'sort: Permission denied';
    assert.strictEqual(actual, expected);
  });
});
