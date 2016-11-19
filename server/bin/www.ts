#!/usr/bin/env node

var app = require('../server').app;
var debug = require('debug')('server:server');
var http = require('http');

var assert = require('assert');

var port = '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen('3000');
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//
// app.get('/compute/', function (request, response) {
//   console.log("-=-=-=-= Server: Compute get Request Received  -=-=-=-=-=-=-");
//    var a = julia.exec("add");
//    console.log(a);
//    response.end();
// });



