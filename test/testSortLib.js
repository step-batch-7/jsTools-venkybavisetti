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
  it('should give sorted file when is no error', function() {
    const error = false;
    const content = 'b\na\nc';
    const printOutput = sinon.spy();
    sort.sortOnFile(error, content, printOutput);
    assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });
  it('should give file error when the error argument is given', function() {
    const error = true;
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
});

describe('sortOnStdin', function() {
  it('should take content from the stdin and sort the content', function() {
    // const printOutput = function(sortResult) {
    //   assert.deepStrictEqual(sortResult.output, 'a\nb\nc');
    //   assert.strictEqual(sortResult.error, '');
    // };
    const myEmitter = new Events();
    const printOutput = sinon.spy();
    sort.sortOnStdin(myEmitter, printOutput);
    myEmitter.emit('data', 'a\n');
    myEmitter.emit('data', 'c\n');
    myEmitter.emit('data', 'b\n');
    myEmitter.emit('end');
    assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
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
  it('should call callback for readFile', () => {
    const argv = ['somePath'];
    const printOutput = sinon.spy();
    const readFile = sinon.fake.yields(null, 'a\nc\nb');
    const fs = { readFile };
    sort.performSort(argv, fs, printOutput);
    assert.isTrue(printOutput.calledWith({ error: '', output: 'a\nb\nc' }));
  });

  it('should give file error when file is not present', () => {
    const argv = ['somePath'];
    const printOutput = sinon.spy();
    const readFile = sinon.fake.yields(true, undefined);
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
    const actual = sort.generateErrorMsg('fileError');
    const expected = 'sort: No such file or directory';
    assert.strictEqual(actual, expected);
  });
});
