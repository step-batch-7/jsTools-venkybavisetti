const { assert } = require("chai");
const sort = require("../src/sortLib.js");
("use strict");

describe("parseUserArgs", function() {
  it("should separate options and fileName", function() {
    const cmdLineArgs = ["-n", "one.txt"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = {
      options: ["-n"],
      fileNames: ["one.txt"]
    };
    assert.deepStrictEqual(actual, expected);
  });
  it("should separate options and fileName when in reverse order", function() {
    const cmdLineArgs = ["one.txt", "-n"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = {
      options: ["-n"],
      fileNames: ["one.txt"]
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("loadFileContent", function() {
  it("should load the content in the file", function() {
    const userArgs = {
      options: ["-n"],
      fileNames: ["one.txt"]
    };
    const readFile = function(path, fileType) {
      assert.strictEqual(path, "one.txt");
      assert.strictEqual(fileType, "utf8");
      return "i am here";
    };
    const existsFile = function(path) {
      assert.strictEqual(path, "one.txt");
      return true;
    };
    const config = { readFile, existsFile };
    const actual = sort.loadFileContent(userArgs, config);
    const expected = { content: "i am here" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("sortFileOnOptions", function() {
  it("should sort the file based on the options", function() {
    const totalLines = "bcd\ncde\nabc";
    const options = [];
    const actual = sort.sortFileOnOptions(totalLines, options);
    const expected = { output: "abc\nbcd\ncde" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("performSortAction", function() {
  it("should perform sort on the file", function() {
    const readFile = function(path, fileType) {
      assert.strictEqual(path, "somePath");
      assert.strictEqual(fileType, "utf8");
      return "bcd\ncde\nabc";
    };
    const existsFile = function(path) {
      assert.strictEqual(path, "somePath");
      return true;
    };
    const config = { readFile, existsFile };
    const cmdLineArgs = ["somePath"];
    const actual = sort.performSortAction(cmdLineArgs, config);
    const expected = { output: "abc\nbcd\ncde" };
    assert.deepStrictEqual(actual, expected);
  });
  it("should get error message when is not present file", function() {
    const readFile = function(path, fileType) {
      assert.strictEqual(path, "somePath");
      assert.strictEqual(fileType, "utf8");
      return "bcd\ncde\nabc";
    };
    const existsFile = function(path) {
      assert.strictEqual(path, "somePath");
      return false;
    };
    const config = { readFile, existsFile };
    const cmdLineArgs = ["somePath"];
    const actual = sort.performSortAction(cmdLineArgs, config);
    const expected = { error: "sort: No such file or directory" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("fileError", function() {
  it("should get error msg for file", function() {
    const actual = sort.fileError();
    const expected = "sort: No such file or directory";
    assert.strictEqual(actual, expected);
  });
});
