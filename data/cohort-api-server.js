/* eslint-disable @typescript-eslint/no-var-requires */
// Defines mock cohort api server which provides REST endpoints for a cohort
// database created via the cohort-api-db.json file. To start the mock api
// service:
// cd to the /data directory in project root and run: node cohort-api-server.js

var jsonServer = require("json-server");
const { isUndefined } = require("lodash");
const crypto = require("crypto");

var server = jsonServer.create();
var router = jsonServer.router("cohort-api-db.json");
var middlewares = jsonServer.defaults();

// custom flags
const context_auth_enabled = true;
const enhanced_logging_enabled = false;

server.use(middlewares);

// create custom function to output headers for each request and to mock
// authorization via either the cookie or custom header
server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  if (enhanced_logging_enabled) {
    console.log(req.headers);
    console.log(req.body);
    console.log(req.params);
    console.log(req.path);
  }

  // handle requests to add new contexts
  if (isContextPost(req)) {
    handleContextPost(req);
  }

  // validate if a cohort add request
  if (isCohortPost(req)) {
    if (isValidCohortPost(req)) {
      handleCohortPost(req);
      next();
    } else {
      console.log("Cohort post failed. Invalid or non-existant context ID.");
      res.sendStatus(400);
    }
  }
  // authorize cohort update and delete requests
  else if (context_auth_enabled && isAuthorizationRequired(req)) {
    if (isAuthorized(req)) {
      console.log("Authorization successful.");
      next();
    } else {
      console.log("Authorization failed.");
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

// get context id from cookie if it exists
function getCookieContext(req) {
  var cookie_context = undefined;
  var cookie_array = [];
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
    console.log("Cookie not found.");
  }
  return cookie_context;
}

// get the cohort id from path
function getCohortIdFromPath(req) {
  var path_id = undefined;
  var path_array = [];
  path_array = req.path.split("/").map(function (value) {
    return value.trim();
  });
  path_id = path_array[path_array.length - 1];
  return path_id;
}

// utility function to read a file as a json object
function readFileAsJson(filename) {
  const fs = require("fs");
  try {
    const raw_data = fs.readFileSync(filename, "utf8");
    //console.log(data);
    const json_data = JSON.parse(raw_data);
    //console.log(json_data["contexts"])
    return json_data;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

// get all contexts
function getContexts() {
  const json_data = readFileAsJson("cohort-api-db.json");
  return json_data["contexts"];
}

// get all cohorts
function getCohorts() {
  const json_data = readFileAsJson("cohort-api-db.json");
  return json_data["cohorts"];
}

// get a cohort by id
function getCohortById(cohort_id) {
  return getCohorts().find((current_cohort) => current_cohort.id === cohort_id);
}

// check if a context exists
function contextExists(context_id) {
  return getContexts().some(
    (current_context) => current_context.id === context_id,
  );
}

// check if a cohort exists
// function cohortExists(cohort_id) {
//   return getCohorts().some(current_cohort => current_cohort.id === cohort_id)
// }

// determines if authorization is required - i.e. if this is a cohort update or delete
function isAuthorizationRequired(req) {
  var is_required = false;
  var path_array = [];

  path_array = req.path.split("/").map(function (value) {
    return value.trim();
  });

  // determine if this is a cohorts endpoint
  if (path_array[1] === "cohorts") {
    // determine if this is an update or delete
    if (
      req.method === "PUT" ||
      req.method === "PATCH" ||
      req.method === "DELETE"
    ) {
      is_required = true;
    }
  }

  return is_required;
}

// check if context ID matches that of the target cohort to be updated/deleted
function isAuthorized(req) {
  // get target cohort and check it exists
  const cohort = getCohortById(getCohortIdFromPath(req));
  if (isUndefined(cohort)) {
    console.log(
      "Could not retrieve cohort. Allowing authorization because expecting 404 error.",
    );
    return true;
  }

  // get context_id from cookie or header
  var context_id = getCookieContext(req);
  if (isUndefined(context_id)) {
    context_id = req.headers["x-context-id"];
    console.log("Using context_id from custom header for authorization.");
  } else {
    console.log("Using context_id from cookie for authorization.");
  }

  // if the context_id can't be retrieved or is invalid, return not authorized
  if (isUndefined(context_id) || !contextExists(context_id)) {
    console.log("Context ID is invalid: ");
    return false;
  }

  // check context_id matches that of cohort
  if (cohort.context_id === context_id) {
    console.log("Context ID matches that of cohort.");
    return true;
  } else {
    console.log("Context ID does not match that of cohort.");
    return false;
  }
}

// check for a context add request
function isContextPost(req) {
  var path_array = [];

  path_array = req.path.split("/").map(function (value) {
    return value.trim();
  });

  if (path_array[1] === "contexts" && req.method === "POST") {
    return true;
  } else {
    return false;
  }
}

// handle missing data in context add requests
function handleContextPost(req) {
  if (!("id" in req.body)) {
    req.body["id"] = crypto.randomUUID();
  }
  if (!("name" in req.body)) {
    req.body["name"] = "testContext" + getContexts().length;
  }
}

// check for a cohort add request
function isCohortPost(req) {
  var path_array = [];

  path_array = req.path.split("/").map(function (value) {
    return value.trim();
  });

  if (path_array[1] === "cohorts" && req.method === "POST") {
    return true;
  } else {
    return false;
  }
}

// check context ID exists to determine if cohort add request is valid
function isValidCohortPost(req) {
  if ("context_id" in req.body && contextExists(req.body["context_id"])) {
    return true;
  } else {
    return false;
  }
}

// handle missing data in cohort add requests
function handleCohortPost(req) {
  if (!("id" in req.body)) {
    req.body["id"] = crypto.randomUUID();
  }
  if (!("name" in req.body) || !req.body["name"]) {
    req.body["name"] = "Custom Cohort " + getCohorts().length;
  }
  if (!("facets" in req.body)) {
    req.body["facets"] = [];
  }
  if (!("frozen" in req.body)) {
    req.body["frozen"] = false;
  }
}
