var _       = require('underscore'),
    express = require('express'),
    utils   = require('./utils');

function SiteRouter() {

  var cors = function(req, res, next) {
    if (req.method === 'OPTIONS') {

      /* Preflight */
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
      if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      }

      res.send(204);

    } else {

      /* Simple */
      res.header('Access-Control-Allow-Origin', '*');

      next();
    }
  };

  var delay = function(req, res, next) {
    var timeout = utils.parseDelay(req.params.delay);

    if (timeout === null) {
      return res.send(400, utils.formatJSON({ message: 'Invalid Delay' }));
    }

    setTimeout(next, timeout);
  };

  var echo = function(req, res) {
    var statusCode = 200;
    var payload    = (_.isEmpty(req.body)) ? req.query : req.body;

    // Custom Status Code
    if (_.has(payload, "_status")) {
      var customStatusCode = utils.parseCustomStatusCode(payload._status);

      if (customStatusCode === null) {
        return res.send(400, utils.formatJSON({ message: 'Invalid Status Code' }));
      }

      statusCode = customStatusCode;
    }

    // Custom Headers
    if (_.has(payload, "_headers")) {
      var customHeaders = utils.parseCustomHeaders(payload._headers);

      if (customHeaders === null) {
        return res.send(400, utils.formatJSON({ message: 'Invalid Headers' }));
      }

      res.header(customHeaders);
    }

    res.header('Access-Control-Expose-Headers', _.values(res._headerNames).join(", "));
    res.header('Content-Type', 'application/json');

    res.send(statusCode, utils.formatJSON(payload));
  };

  var router = express.Router();

  router.all('*', cors);
  router.all('/:delay', delay, echo);
  router.all('/', echo);

  return router;
}

module.exports = new SiteRouter();