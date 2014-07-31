exports.errorHandler = function(err, req, res, next) {

  // If the bodyParser middleware chokes on bad JSON it
  // will add a status property to the err object with a 4xx error code

  var code = err.status || 500;

  res.send(code, exports.formatJSON(err));

  // next(err);
};

exports.formatJSON = function(obj) {
  return JSON.stringify(obj, null, '  ') + '\n';
};