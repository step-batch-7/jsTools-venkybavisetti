const { assert } = require("chai");
const sort = require("../src/sortLib.js");
("use strict");

describe("parseUserArgs", function() {
  it("should separate options and fileName", function() {
    const cmdLineArgs = ["-n", "one.txt"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = { options: ["-n"], fileName: ["one.txt"] };
    assert.deepStrictEqual(actual, expected);
  });
  it("should separate options and fileName when in reverse order", function() {
    const cmdLineArgs = ["one.txt", "-n"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = { options: ["-n"], fileName: ["one.txt"] };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("loadFileContent", function() {
  it("should load the content in the file", function() {
    const path = "samePath";
    const read = function(path, fileType) {
      assert.strictEqual(path, "samePath");
      assert.strictEqual(fileType, "utf8");
      return "i am here";
    };
    const actual = sort.loadFileContent(path, read);
    const expected = "i am here";
    assert.strictEqual(actual, expected);
  });
});

describe("parseContentOfFile", function() {
  it("should get the content in an arrays", function() {
    const content = "i\nam\ngood";
    const actual = sort.parseContentOfFile(content);
    const expected = ["i", "am", "good"];
    assert.deepStrictEqual(actual, expected);
  });
  it("should get an empty array when file contains no content", function() {
    const content = "";
    const actual = sort.parseContentOfFile(content);
    const expected = [""];
    assert.deepStrictEqual(actual, expected);
  });
});
