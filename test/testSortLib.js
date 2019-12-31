'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const Events = require('events');
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

describe('sortOnFile', function() {
  it('should give sorted file when there is no error', function() {
    const error = false;
    const content = 'b\na\nc';
    const printOutput = sinon.spy();
    sort.sortOnFile(error, content, printOutput);
    assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });
  it('should give file error when the error argument is given', function() {
    const error = { code: 'ENOENT' };
    const content = undefined;
    const printOutput = sinon.spy();
    sort.sortOnFile(error, content, printOutput);
    assert.isTrue(
      printOutput.calledWith({
        error: 'sort: No such file or directory',
        output: ''
      })
    );
  });
  it('should give directory error when directory is given as file', function() {
    const error = { code: 'EISDIR' };
    const content = undefined;
    const printOutput = sinon.spy();
    sort.sortOnFile(error, content, printOutput);
    assert.isTrue(
      printOutput.calledWith({
        error: 'sort: Is a directory',
        output: ''
      })
    );
  });
});

describe('sortOnStdin', function() {
  it('should take content from the stdin and sort the content', function() {
    // const printOutput = function(sortResult) {
    //   assert.deepStrictEqual(sortResult.output, 'a\nb\nc');
    //   assert.strictEqual(sortResult.error, '');
    // };
    const myEmitter = new Events();
    myEmitter.setEncoding = sinon.fake();
    const printOutput = sinon.spy();
    sort.sortOnStdin(myEmitter, printOutput);
    myEmitter.emit('data', 'a\n');
    myEmitter.emit('data', 'c\n');
    myEmitter.emit('data', 'b\n');
    myEmitter.emit('end');
    assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
    assert(myEmitter.setEncoding.calledWith('utf8'));
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
  it('should call callback for readFile', done => {
    const argv = ['somePath'];
    const fs = { readFile: sinon.fake() };
    const printOutput = sinon.spy(done());
    const callback = sinon.fake.yieldsAsync(null, 'a\nc\nb');
    sinon.replace(fs, 'readFile', callback);
    sort.performSort(argv, fs, printOutput);
    assert(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
    const expected = ['somePath', 'utf8'];
    const [filePath, encoding] = callback.firstCall.args;
    assert.deepStrictEqual([filePath, encoding], expected);
  });

  it('should give file error when file is not present', done => {
    const argv = ['somePath'];
    const printOutput = sinon.spy(done());
    const readFile = sinon.fake.yieldsAsync(true, undefined);
    const fs = { readFile };
    // const fs = {
    //   readFile: function(path, encoding, callback) {
    //     assert.deepStrictEqual(path, 'somePath');
    //     assert.deepStrictEqual(encoding, 'utf8');
    //     callback(true, undefined);
    //   }
    // };
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
