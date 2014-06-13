var _       = require('underscore'),
    express = require('express');

function router() {

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
      return res.json(400, { message: 'Invalid Delay' });
    }

    setTimeout(next, timeout);
  };

  var echo = function(req, res) {
    var payload = (_.isEmpty(req.body)) ? req.query : req.body;

    res.json(payload);
  };


  var siteRouter = express.Router();

  siteRouter.all('*', cors);
  siteRouter.all('/:delay', delay, echo);
  siteRouter.all('/', echo);

  return siteRouter;
}

module.exports = router;