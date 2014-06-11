var express      = require('express'),
    bodyParser   = require('body-parser'),
    errorHandler = require('./error-handler'),
    router       = require('./router');

var port = process.env.PORT || 3000;

var app = express();

app.disable('x-powered-by');
app.use(bodyParser());
app.use(errorHandler());
app.use('/', router());
app.listen(port);

console.log('mock-turtle is running on port ' + port);