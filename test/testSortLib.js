'use strict';

const { assert } = require('chai');
const sort = require('../src/sortLib.js');
const sinon = require('sinon');

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
    const printOutput = function(sortResult) {
      assert.deepStrictEqual(sortResult.output, 'a\nb\nc');
      assert.strictEqual(sortResult.error, '');
    };
    sort.sortOnFile(error, content, printOutput);
  });
  it('should give file error when the error argument is given', function() {
    const error = true;
    const content = undefined;
    const printOutput = function(sortResult) {
      assert.strictEqual(sortResult.output, '');
      assert.strictEqual(sortResult.error, 'sort: No such file or directory');
    };
    sort.sortOnFile(error, content, printOutput);
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
    const printOutput = function(sortResult) {
      assert.deepStrictEqual(sortResult.output, 'a\nb\nc');
      assert.strictEqual(sortResult.error, '');
    };
    const readFile = sinon.fake.yields(null, 'a\nc\nb');
    const fs = { readFile };
    // const fs = {
    //   readFile: function(path, encoding, callback) {
    //     assert.deepStrictEqual(path, 'somePath');
    //     assert.deepStrictEqual(encoding, 'utf8');
    //     callback(null, 'a\nc\nb');
    //   }
    // };
    sort.performSort(argv, fs, printOutput);
  });

  it('should give file error when file is not present', () => {
    const argv = ['somePath'];

    const printOutput = function(sortResult) {
      assert.deepStrictEqual(
        sortResult.error,
        'sort: No such file or directory'
      );
      assert.strictEqual(sortResult.output, '');
    };
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
  });
});

describe('generateErrorMsg', function() {
  it('should get file error', function() {
    const actual = sort.generateErrorMsg('fileError');
    const expected = 'sort: No such file or directory';
    assert.strictEqual(actual, expected);
  });
});
