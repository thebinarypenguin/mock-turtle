/*jshint expr: true*/

var should  = require('should'),
    request = require('supertest'),
    server  = require('../src/server.js'),
    utils   = require('../src/utils.js');

describe('Root Route', function() {

  describe('with no input', function() {
    it('Response code should be 200 OK', function(done) {
      request(server).get('/').expect(200, done);
    });

    it('Content-Type should be application/json', function(done) {
      request(server).get('/').expect('Content-Type', /application\/json/, done);
    });

    it('Response body should be {}', function(done) {
      request(server).get('/').expect({}, done);
    });
  });

  describe('with URL parameters', function() {
    var input = { greeting: "Hello World" };

    it('Response code should be 200 OK', function(done) {
      request(server).get('/').query(input).expect(200, done);
    });

    it('Content-Type should be application/json', function(done) {
      request(server).get('/').query(input).expect('Content-Type', /application\/json/, done);
    });

    it('Response body should match input', function(done) {
      request(server).get('/').query(input).expect(input, done);
    });
  });

  describe('with application/x-www-form-urlencoded encoded body', function() {
    var input = { greeting: "Hello World" };

    it('Response code should be 200 OK', function(done) {
      request(server).post('/').type('form').send(input).expect(200, done);
    });

    it('Content-Type should be application/json', function(done) {
      request(server).post('/').type('form').send(input).expect('Content-Type', /application\/json/, done);
    });

    it('Response body should match input', function(done) {
      request(server).post('/').type('form').send(input).expect(input, done);
    });
  });

  describe('with application/json encoded body', function() {
    var input = { greeting: "Hello World" };

    it('Response code should be 200 OK', function(done) {
      request(server).post('/').type('json').send(input).expect(200, done);
    });

    it('Content-Type should be application/json', function(done) {
      request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
    });

    it('Response body should match input', function(done) {
      request(server).post('/').type('json').send(input).expect(input, done);
    });
  });
});

describe('Delay Route', function() {
  this.timeout(4000);

  it('Response code should be 200 OK', function(done) {
    request(server).get('/3s').expect(200, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).get('/3s').expect('Content-Type', /application\/json/, done);
  });

  it('Should take at least 3 seconds', function(done) {
    var time = process.hrtime();

    request(server).get('/3s').end(function(err, res){
      if (err) { return done(err); }

      time = process.hrtime(time);
      if (time[0] < 3) {
        return done(new Error('Response was not delayed'));
      }

      done()
    });
  });
});

describe('Custom Status Code', function() {
  var input = { _status: 418 };

  it("Response code should match input", function(done) {
    request(server).post('/').type('json').send(input).expect(418, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
  });
});

describe('Custom Headers', function() {
  var input = { _headers: { foo: "bar" } };

  it("Response code should be 200 OK", function(done) {
    request(server).post('/').type('json').send(input).expect(200, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
  });

  it('Custom header (and value) should be present', function(done) {
    request(server).post('/').type('json').send(input).expect('foo', 'bar', done);
  });

  it('Access-Control-Expose-Headers should contain the custom header', function(done) {
    request(server).post('/').type('json').send(input).expect('Access-Control-Expose-Headers', /foo/, done);
  });
});

describe('Invalid Delay', function() {
  it("Response code should be 400 Bad Request", function(done) {
    request(server).get('/foo').expect(400, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).get('/foo').expect('Content-Type', /application\/json/, done);
  });

  it('Response body should be an error message', function(done) {
    request(server).get('/foo').expect(function(res) {
      if (!res.body.message) { throw new Error('Missing error message'); }
    }).end(done);
  });
});

describe('Invalid Status Code', function() {
  var input = { _status: "foo" };

  it("Response code should be 400 Bad Request", function(done) {
    request(server).post('/').type('json').send(input).expect(400, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
  });

  it('Response body should be an error message', function(done) {
    request(server).post('/').type('json').send(input).expect(function(res) {
      if (!res.body.message) { throw new Error('Missing error message'); }
    }).end(done);
  });
});

describe('Invalid Headers', function() {
  var input = { _headers: "foo" };

  it("Response code should be 400 Bad Request", function(done) {
    request(server).post('/').type('json').send(input).expect(400, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
  });

  it('Response body should be an error message', function(done) {
    request(server).post('/').type('json').send(input).expect(function(res) {
      if (!res.body.message) { throw new Error('Missing error message'); }
    }).end(done);
  });
});

describe('Invalid Body', function() {
  var input = "foo: bar";

  it("Response code should be 400 Bad Request", function(done) {
    request(server).post('/').type('json').send(input).expect(400, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).post('/').type('json').send(input).expect('Content-Type', /application\/json/, done);
  });

  it('Response body should be an error message', function(done) {
    request(server).post('/').type('json').send(input).expect(function(res) {
      if (!res.body.message) { throw new Error('Missing error message'); }
    }).end(done);
  });
});

describe('Parsing Functions', function() {

  describe('Parse Delay', function() {
    it('Should accept valid input', function(done) {
      var valid = [
        { delay: '1h2m3s', milliseconds: 3723000   },
        { delay: '4h5m',   milliseconds: 14700000  },
        { delay: '6m7s',   milliseconds: 367000    },
        { delay: '8h9s',   milliseconds: 28809000  },
        { delay: '90s',    milliseconds: 90000     },
        { delay: '90m',    milliseconds: 5400000   },
        { delay: '90h',    milliseconds: 324000000 }
      ];

      for (var i=0; i<valid.length; i++) {
        utils.parseDelay(valid[i]['delay']).should.eql(valid[i]['milliseconds']);
      }

      done();
    });

    it('Should reject invalid input', function(done) {
      var invalid = ['hh', 'mm', 'ss', '42', '1 m', '2s2m', {}, [], undefined, null, NaN, true, false];

      for (var i=0; i<invalid.length; i++) {
        (utils.parseDelay(invalid[i]) === null).should.be.true;
      }

      done();
    });
  });

  describe('Parse Status Code', function() {
    it('Should accept valid input', function(done) {
      var valid = [100, "200", " 300 ", 4444, 5];

      for (var i=0; i<valid.length; i++) {
        (utils.parseCustomStatusCode(valid[i]) === null).should.be.false;
      }

      done();
    });

    it('Should reject invalid input', function(done) {
      var invalid = ["foo", "2xx", "", {}, [], undefined, null, NaN, true, false];

      for (var i=0; i<invalid.length; i++) {
        (utils.parseCustomStatusCode(invalid[i]) === null).should.be.true;
      }

      done();
    });
  });

  describe('Parse Headers', function() {
    it('Should accept valid input', function(done) {
      var valid = [
        {
          "foo": "bar"
        },
        {
          "X-RateLimit-Limit" : 60,
          "X-RateLimit-Remaining" : 56
        }
      ];

      for (var i=0; i<valid.length; i++) {
        (utils.parseCustomHeaders(valid[i]) === null).should.be.false;
      }

      done();
    });

    it('Should reject invalid input', function(done) {
      var invalid = [
        "{ key: value }", {}, [], undefined, null, NaN, true, false
      ];

      for (var i=0; i<invalid.length; i++) {
        (utils.parseCustomHeaders(invalid[i]) === null).should.be.true;
      }

      done();
    });
  });
});
