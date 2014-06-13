var express = require('express');

function errorHandler(err, req, res, next) {

  // If the bodyParser middleware chokes on bad JSON it
  // will add a status property to the err object with a 4xx error code

  var code = err.status || 500;

  res.json(code, err);

  // next(err);
}

module.exports = function() { return errorHandler; };