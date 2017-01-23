module.exports = (function(){
  
  var express, req;
  if (!process.browser){
    var nodeRequire = require;
    var express = nodeRequire("express");
    var rq = nodeRequire("request");
    var bodyParser = nodeRequire("body-parser");
  } else {
    var rq = require("xhr");
  };

  function api(port, api){
    return new Promise(function(resolve, reject){
      var app = express();
      app.use(bodyParser.json());
      function callFunc(req, res){
        try {
          var url = req.url;
          var parens = url.indexOf("(");
          if (parens !== -1){
            var name = url.slice(1, parens);
            var args = JSON.parse("["+decodeURIComponent(url.slice(parens+1, -1))+"]");
          } else {
            var name = url.slice(1);
            var args = req.body;
          }
          var result = api[name].apply(null, args);
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
  };

  function at(url){
    return new Proxy({}, {
      get: function(target, func){
        return function(){
          var args = [].slice.call(arguments);
          return new Promise(function(resolve, reject){
            rq.post({uri: url+"/"+func+"("+JSON.stringify(args).slice(1,-1)+")"}, function(err, res, body){
              if (err) reject(err);
              else resolve(JSON.parse(body));
            });
          });
        };
      }
    });
  };

  return {
    api: api,
    at: at
  };
})();
