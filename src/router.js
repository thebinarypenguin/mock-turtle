var _       = require('underscore'),
    express = require('express'),
    utils   = require('./utils');

function SiteRouter() {

  var parseDelay = function(delay) {
    var lowered = delay.toLowerCase();
    var hCount, mCount, sCount = 0;
    var pieces = null;
    var milliseconds = 0;

    // Test for disallowed characters
    if (/^[0-9hms]+$/.test(lowered) === false) {
      return null;
    }

    // Count occurrences of the letters 'h', 'm', and 's'
    for (var a=0; a<lowered.length; a++) {
      if (lowered[a] === 'h') { hCount++; }
      if (lowered[a] === 'm') { mCount++; }
      if (lowered[a] === 's') { sCount++; }
    }

    // Test for too many occurrences of the letters 'h', 'm', and 's'
    if (hCount > 1 || mCount > 1 || sCount > 1) {
      return null;
    }

    // Parse delay into pieces
    pieces = /^([0-9]+[h|m|s])?([0-9]+[h|m|s])?([0-9]+[h|m|s])?$/.exec(lowered);
    if (pieces === null) {
      return null;
    }

    // Calculate milliseconds from pieces
    for (var b=1; b<=3; b++) {
      if (pieces[b]) {
        if (pieces[b].slice(-1) === 'h') { milliseconds += pieces[b].slice(0, -1) * 1000 * 60 * 60; }
        if (pieces[b].slice(-1) === 'm') { milliseconds += pieces[b].slice(0, -1) * 1000 * 60; }
        if (pieces[b].slice(-1) === 's') { milliseconds += pieces[b].slice(0, -1) * 1000; }
      }
    }

    return milliseconds;
  };

  var parseCustomStatusCode = function(status) {
    if (_.isUndefined(status) || _.isNull(status) || _.isArray(status) || _.isObject(status)) {
      return null;
    }

    return status;
  };

  var parseCustomHeaders = function(headers) {
    if (!_.isObject(headers)) {
      return null;
    }

    var err = _.find(_.values(headers), function(v) {
      if (_.isUndefined(v) || _.isNull(v) || _.isArray(v) || _.isObject(v)) {
        return true;
      }
    })

    if (err) {
      return null;
    }

    return headers;
  };

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
    var timeout = parseDelay(req.params.delay);

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
      var customStatusCode = parseCustomStatusCode(payload._status);

      if (customStatusCode === null) {
        return res.send(400, utils.formatJSON({ message: 'Invalid Status Code' }));
      }

      statusCode = customStatusCode;
    }

    // Custom Headers
    if (_.has(payload, "_headers")) {
      var customHeaders = parseCustomHeaders(payload._headers);

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