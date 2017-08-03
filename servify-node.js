const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const servify = require("./servify-browser");

const api = (port, api) => new Promise((resolve, reject) => {
  var app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use((error, req, res, next) => {
      if (error.message === "invalid json")
        res.send("null");
      else
        next();
  });
  function callFunc(req, res){
    try {
      var url = req.url;
      var parens = url.indexOf("(");
      if (parens !== -1){
        var name = url.slice(1, parens);
        var args = JSON.parse("["+decodeURIComponent(url.slice(parens+1, -1))+"]");
      } else {
        var name = url.slice(1);
        var args = [req.body];
      }
      var result = api[name].apply(null, args);
      if (result.then)
        result.then(result => res.json(result));
      else
        res.json(result);
    } catch(e) {
      res.send("null");
    };
  };
  app.get("*", callFunc);
  app.post("*", callFunc);
  app.listen(port, resolve).on("error", reject);
});

module.exports = {
  at: servify.at,
  api: api
};
