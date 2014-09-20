var _ = require('underscore');

exports.errorHandler = function(err, req, res, next) {

  // If the bodyParser middleware chokes on bad JSON it
  // will add a status property to the err object with a 4xx error code

  var code    = err.status  || 500;
  var message = err.message || "Unknown Error";

  res.header('Content-Type', 'application/json');

  res.send(code, exports.formatJSON({ message: message }));

  // next(err);
};

exports.formatJSON = function(obj) {
  return JSON.stringify(obj, null, '  ') + '\n';
};

exports.parseDelay = function(delay) {
  if (!delay || !_.isFunction(delay.toLowerCase)) {
    return null;
  }

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
  pieces = /^([0-9]+[h])?([0-9]+[m])?([0-9]+[s])?$/.exec(lowered);
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

exports.parseCustomStatusCode = function(status) {
  if (!status || !_.isFunction(status.toString)) {
    return null;
  }

  var clean = status.toString().replace(/\s/g, "");

  if (/^[0-9]+$/.test(clean) === false) {
    return null;
  }

  return clean;
};

exports.parseCustomHeaders = function(headers) {
  if (!_.isObject(headers) || _.isEmpty(headers)) {
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