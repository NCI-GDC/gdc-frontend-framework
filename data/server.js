var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router("db.json");
var middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  console.log(req.headers);
  if (req.headers["x-context-id"] != "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER") {
    res.sendStatus(401);
  } else {
    next();
  }
});

server.use(router);

server.listen(3500, function () {
  console.log("Custom JSON Server is running");
});
