var port = 7231;
var util = require('util');
var express = require('express');
var socketio = require('socket.io');

var server = express();
var http_server = require('http').createServer(server);
var io = socketio.listen(http_server, { log: false });

http_server.listen(port);

server.use('/', express.static(__dirname+'/public'));

util.puts('Listening on ' + port + '...');
util.puts('Press Ctrl + C to stop.');
var game = require('./game.js');
var configuration = {
	'io': io
}
game.setup(configuration);