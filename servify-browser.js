const request = require("xhr-request-promise");

module.exports = {
  at: url => new Proxy({}, {
    get: function (target, func) {
      return function() {
        const args = JSON.stringify([].slice.call(arguments)).slice(1,-1);
        return request(url + "/" + func + "(" + args + ")", {method: "POST"})
          .then(body => JSON.parse(body));
      }
    }
  })
};
