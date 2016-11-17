#!/usr/bin/env node

/**
* Module dependencies.
*/

var app = require('../server').app;
var debug = require('debug')('server:server');
var http = require('http');

var assert = require('assert');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
//
// app.get('/compute/', function (request, response) {
//   console.log("-=-=-=-= Server: Compute get Request Received  -=-=-=-=-=-=-");
//    var a = julia.exec("add");
//    console.log(a);
//    response.end();
// });



/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
// server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
