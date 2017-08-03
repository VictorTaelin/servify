var servify = require("./..");
var assert = require("assert");

describe("Servify", function(){
  it("must be able to create a service and call its functions", async () => {

    // Creates service
    var count = 0;
    
    await servify.api(7171, {
      square: (x) => x * x,
      concat: (a, b) => a.concat(b),
      count: () => ++count
    });

    // Uses service
    var lib = servify.at("http://localhost:7171");

    assert(await lib.square(3) === 9);
    assert(await lib.count() === 1);
    assert(JSON.stringify(await lib.concat([1,2],[3,4])) === "[1,2,3,4]");

  });
});
