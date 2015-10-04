/*
Server Side JavaScript for TicTacToe
Author: Khalid Omar Ali
CLIENT/SERVER MODEL:
Each player is a client and all clients communicate with the server
PLAYER JOINS: 
Each player exists as an object (with socket.id key) on the server
When a player logs on, they should be updated with the status
of each player on the server
Each player must join a room/lobby to ensure they start from
the same initial game state
GAME STATE: 
When a player clicks, the client emits X or O to the server
Server updates state of each character in the 'world' and 
replies back with a packet containing the state of the 
character of a player
Clients simply incorporate the updates from server
RESOURCE: 
Glenn Fiedler's What Every Programmer Needs to know
about Game Networking  
*/
'use strict';

var express = require('express');
// invoke express
var app = express();
// create a HTTP server
var server = require('http').Server(app);
// initialise new instance of socket.io 
// by passing the http server object
var io = require('socket.io')(server);
// listen to TCP port in the env or 3000
var port = process.env.port || 3000;
// grab random string to identify game room
var randomString = require('randomstring');
// use colors for debugging
var colors = require('colors');
// routes - when a get request is made
app.get('/', function(req, res) {
	// redirect client to game room (using dynamic routing)
	var id = randomString.generate(7);
	res.redirect('/tictactoe/' + id);
});
// dynamic route
app.get('/tictactoe/:id', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
// static route - middleware to handle requests to static files
app.use('/public', express.static('public'));

// start using socket.io
io.on('connection', function(socket) {
	// states
	var clientNo;
	socket.on('room', function(room) {
		console.log("what is in room event data: " + room)
		var roomName = room;
	    var gameLobby;
		socket.join(room);
		// list all clients connected to a room
		gameLobby = io.nsps['/'].adapter.rooms[roomName];
		console.log("what is in game lobby: ".red + gameLobby);
		// get number of clients in a room
		clientNo = Object.keys(gameLobby).length;
		if (clientNo === 1) {
			// hey client1, you are player 1
			io.to(socket.id).emit('player', 1);
		} else if (clientNo === 2) {
			// hey client2, are you are player 2
			io.to(socket.id).emit('player', 2);
			// game can now begin
			io.to(roomName).emit('startGame', true);
			// and player 1 goes first
			io.to(roomName).emit('whoseTurn', 1);
		}
	});
});



server.listen(port, function() {
	console.log('listening on port ' + port);
});