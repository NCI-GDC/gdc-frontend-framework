var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router("db.json");
var middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  console.log(req.headers);

  // get context id from cookie
  let cookie_context = "";
  if ("cookie" in req.headers) {
    //console.log("Cookie found: " + req.headers["cookie"])

    cookie_array = req.headers["cookie"].split(";").map(function (value) {
      return value.trim();
    });

    for (var i = 0; i < cookie_array.length; i++) {
      if (cookie_array[i].split("=")[0] == "cookie-x-context-id") {
        cookie_context = cookie_array[i].split("=")[1];
        //console.log("cookie-x-content-id found with value " + cookie_context)
        break;
      }
    }
  } else {
    console.log("Cookie not found");
  }

  // authorize via header or cookie
  if (req.headers["x-context-id"] == "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER") {
    console.log("Authorized via header");
    next();
  } else if (cookie_context == "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER") {
    console.log("Authorized via cookie");
    next();
  } else {
    res.sendStatus(401);
  }
});

server.use(router);

server.listen(3500, function () {
  console.log("Custom JSON Server is running");
});
