/*jshint expr: true*/

var should  = require('should'),
    request = require('supertest'),
    server  = require('../src/server.js');

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
  this.timeout(0);

  it('Response code should be 200 OK', function(done) {
    request(server).get('/3s').expect(200, done);
  });

  it('Content-Type should be application/json', function(done) {
    request(server).get('/3s').expect('Content-Type', /application\/json/, done);
  });

  it('Should take a little while', function(done) {
    false.should.be.true
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

