const { assert } = require("chai");
const sort = require("../src/sortLib.js");
("use strict");

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

describe("loadFileContent", function() {
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
  it("should perform sort on the file", function() {
    const readFileSync = function(path, fileType) {
      assert.strictEqual(path, "somePath");
      assert.strictEqual(fileType, "utf8");
      return "bcd\ncde\nabc";
    };
    const existsSync = function(path) {
      assert.strictEqual(path, "somePath");
      return true;
    };
    const config = { readFileSync, existsSync };
    const cmdLineArgs = ["somePath"];
    const actual = sort.performSort(cmdLineArgs, config);
    const expected = { output: "abc\nbcd\ncde", error: "" };
    assert.deepStrictEqual(actual, expected);
  });
  it("should get error message when is not present file", function() {
    const readFileSync = function(path, fileType) {
      assert.strictEqual(path, "somePath");
      assert.strictEqual(fileType, "utf8");
      return "bcd\ncde\nabc";
    };
    const existsSync = function(path) {
      assert.strictEqual(path, "somePath");
      return false;
    };
    const config = { readFileSync, existsSync };
    const cmdLineArgs = ["somePath"];
    const actual = sort.performSort(cmdLineArgs, config);
    const expected = { error: "sort: No such file or directory", output: "" };
    assert.deepStrictEqual(actual, expected);
  });
  it("should get error message when options are present", function() {
    const readFileSync = function(path, fileType) {
      assert.strictEqual(path, "somePath");
      assert.strictEqual(fileType, "utf8");
      return "bcd\ncde\nabc";
    };
    const existsSync = function(path) {
      assert.strictEqual(path, "somePath");
      return true;
    };
    const config = { readFileSync, existsSync };
    const cmdLineArgs = ["somePath", "-n"];
    const actual = sort.performSort(cmdLineArgs, config);
    const expected = { error: "sort: invalid options", output: "" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("generateErrorMsg", function() {
  it("should get file error", function() {
    const actual = sort.generateErrorMsg("fileError");
    const expected = "sort: No such file or directory";
    assert.strictEqual(actual, expected);
  });
});
