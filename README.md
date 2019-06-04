# Mock Turtle

An easy to use echo server for mocking JSON APIs.

[![Build Status](https://travis-ci.org/thebinarypenguin/mock-turtle.svg?branch=master)](https://travis-ci.org/thebinarypenguin/mock-turtle) [![Greenkeeper badge](https://badges.greenkeeper.io/thebinarypenguin/mock-turtle.svg)](https://greenkeeper.io/)

## Features

* Easily specify
  * HTTP status code
  * HTTP headers
  * HTTP message body
  * A delay in hours, minutes and/or seconds
* CORS enabled
* Example running at http://mock-turtle.herokuapp.com

> Note: If you ever notice the [example server](http://mock-turtle.herokuapp.com)
not working please [create an issue](https://github.com/thebinarypenguin/mock-turtle/issues).

## Examples

### Hello World

via URL parameters

```
curl http://mock-turtle.herokuapp.com/?greeting=Hello%20World
```

via application/x-www-form-urlencoded

```
curl http://mock-turtle.herokuapp.com \
  -d "greeting=Hello World"
```

via application/json

```
curl http://mock-turtle.herokuapp.com \
  -H "Content-Type: application/json" \
  -d '{"greeting": "Hello World"}'
```

### Specify a Delay

```
curl http://mock-turtle.herokuapp.com/5s \
  -H "Content-Type: application/json"    \
  -d '{"message":"I took atleast 5 seconds"}'
```

The format for the delay string uses the letters `h`, `m` and `s`. Here are some examples:
`10s`, `1m30s`, `2h15m4s`

### Specify Response Code

```
curl http://mock-turtle.herokuapp.com \
  -H "Content-Type: application/json" \
  -d '{"_status": "400"}'
```

### Specify Custom Response Headers

```
curl http://mock-turtle.herokuapp.com \
  -H "Content-Type: application/json" \
  -d '{"_headers": {"Some Header":"Some Value", "Another Header":"Another Value"}}'
```

