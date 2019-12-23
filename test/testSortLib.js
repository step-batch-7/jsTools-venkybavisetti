const { assert } = require("chai");
const sort = require("../src/sortLib.js");

describe("parseUserArgs", function() {
  it("should separate options and fileName", function() {
    const cmdLineArgs = ["-n", "one.txt"];
    const actual = sort.parseUserArgs(cmdLineArgs);
    const expected = { options: ["-n"], fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });
});
