"use strict";

const { assert } = require("chai");
const sort = require("../src/sortLib.js");
const sinon = require("sinon");

describe("parseUserArgs", function() {
  it("should separate options and fileName", function() {
    const cmdLineArgs = ["one.txt"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = {
      fileName: "one.txt"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("sortOnFile", function() {
  it("should load the content in the file", function() {
    const userArgs = {
      options: ["-n"],
      fileNames: ["one.txt"]
    };
    const readFileSync = function(path, fileType) {
      assert.strictEqual(path, "one.txt");
      assert.strictEqual(fileType, "utf8");
      return "i am here";
    };
    const existsSync = function(path) {
      assert.strictEqual(path, "one.txt");
      return true;
    };
    const config = { readFileSync, existsSync };
    const actual = sort.loadFileContent(userArgs, config);
    const expected = { content: "i am here" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("sortOnContent", function() {
  it("should sort the file based on the content", function() {
    const content = "bcd\ncde\nabc";
    const actual = sort.sortOnContent(content);
    const expected = "abc\nbcd\ncde";
    assert.deepStrictEqual(actual, expected);
  });
  it("should sort the file when file is empty", function() {
    const content = "";
    const actual = sort.sortOnContent(content);
    const expected = "";
    assert.deepStrictEqual(actual, expected);
  });
});

describe("performSort", function() {
  it("should call callback for readFile", () => {
    const argv = ["somePath"];
    const printOutput = function(sortResult) {
      assert.deepStrictEqual(sortResult.output, "a\nb\nc");
      assert.strictEqual(sortResult.error, "");
    };
    const fs = {
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, "somePath");
        assert.deepStrictEqual(encoding, "utf8");
        callback(null, "a\nc\nb");
      }
    };
    sort.performSort(argv, fs, printOutput);
  });

  it("should give no such file error if file is not present in the given path", () => {
    const argv = ["somePath"];

    const printOutput = function(sortResult) {
      assert.deepStrictEqual(sortResult.error, "sort: No such file or directory");
      assert.strictEqual(sortResult.output, "");
    };
    const fs = {
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, "somePath");
        assert.deepStrictEqual(encoding, "utf8");
        callback(true, undefined);
      }
    };
    sort.performSort(argv, fs, printOutput);
  });
});

describe("generateErrorMsg", function() {
  it("should get file error", function() {
    const actual = sort.generateErrorMsg("fileError");
    const expected = "sort: No such file or directory";
    assert.strictEqual(actual, expected);
  });
});
