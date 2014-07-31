var express      = require('express'),
    bodyParser   = require('body-parser'),
    utils        = require('./utils'),
    router       = require('./router');

var port = process.env.PORT || 3000;

var app = express();

app.disable('etag');
app.disable('x-powered-by');

app.use(bodyParser());
app.use(utils.errorHandler);
app.use('/', router);

app.listen(port);

console.log('mock-turtle is running on port ' + port);

module.exports = app;