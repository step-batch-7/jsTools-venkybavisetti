const { assert } = require("chai");
const sort = require("../src/sortLib.js");

describe("sort", function() {
  it("should give hi", function() {
    assert.strictEqual(sort, "hi");
  });
});
