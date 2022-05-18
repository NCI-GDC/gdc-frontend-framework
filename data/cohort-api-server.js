// eslint @typescript-eslint/no-var-requires: "off"
// Defines mock cohort api server which provides REST endpoints for a cohort
// database created via the cohort-api-db.json file. To start the mock api
// service:
// cd to the /data directory in project root and run: node cohort-api-server.js

var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router("cohort-api-db.json");
var middlewares = jsonServer.defaults();

server.use(middlewares);

// create custom function to output headers for each request and to mock
// authorization via either the cookie or custom header
server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  console.log(req.headers);

  // authorize update and delete requests
  if (
    req.method === "PUT" ||
    req.method === "PATCH" ||
    req.method === "DELETE"
  ) {
    // get context id from cookie if it exists
    let cookie_context = "";
    let cookie_array = [];
    if ("cookie" in req.headers) {
      cookie_array = req.headers["cookie"].split(";").map(function (value) {
        return value.trim();
      });

      for (var i = 0; i < cookie_array.length; i++) {
        if (cookie_array[i].split("=")[0] == "context-id") {
          cookie_context = cookie_array[i].split("=")[1];
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
      console.log("Authorization failed");
      res.sendStatus(401);
    }
  } else {
    next();
  }
});

server.use(router);

server.listen(3500, function () {
  console.log("Mock Cohort API server is running");
});
