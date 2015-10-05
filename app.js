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
When a player clicks, the client emits position of move to the server
Server updates state of each character in the 'world' and 
replies back with a packet containing the state of the 
character of a player and the client simply draws. 
Clients simply incorporate the updates from server.
Clients really only know how to update UI

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
// globals
// var allGames = [];
var playerQue = [];
var WIN_COMBO = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];
var MAX_PLAYERS = 2;
// var playerQue = [];
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
// helper functions
function getPlayerNoFromQue(id) {
	if (typeof id === "undefined") {
		console.log("id undefined in getPlayerNoFromQue fn");
		return false;
	}
	var index = playerQue.indexOf(id);
	if (index === -1) {
		console.log("negative index in getPlayerNoFromQue fn");
		return false;
	}
	return index + 1;
}

function addPlayerToQue(id) {
	// defensive check
	if (typeof id === "undefined") {
		console.log("id undefined in addPlayerToQue fn");
		return false;
	}
	// fail quick test
	if (playerQue.length === MAX_PLAYERS) {
		console.log("playerQue length equal to MAX_PLAYERS in addPlayerToQue fn");
		return false;
	}
	playerQue.push(id);
	return true;
}

function deletePlayerFromQue(id) {
	if (typeof id === "undefined") {
		console.log("id undefined in deletePlayerFromQue fn");
		return false;
	}
	if (playerQue.length > 0) {
		console.log("playerQue length equal to 0 in playerQue fn");
		return false;
	}
	// hoisting occurs between functions
	var index = playerQue.indexOf(id);
	playerQue.splice(index, 1);
	return true;
}
// start using socket.io
io.on('connection', function(socket) {
	// states
	var clientNo;
	var won = false;
	var draw = false;
	var roomName;
	var board = [];
	var moves;
	var player1Id;
	var player2Id;
	socket.on('room', function(room) {
		var gameLobby;
		roomName = room;
		socket.join(room);
		if (addPlayerToQue(socket.id)) {
			console.log('adding player to que with socket id '.yellow);
		} else {
			console.log('error message on addPlayerToQue'.yellow);
		}
		// emit room status and start game events to client
		if (getPlayerNoFromQue(socket.id) === 1) {
			io.to(socket.id).emit('roomStatus', {
				player: 1,
				status: "wait"
			});
		} else if (getPlayerNoFromQue(socket.id) === 2) {
			io.to(socket.id).emit('roomStatus', {player: 2});
			io.to(roomName).emit('startGame', true);
		}
	});
	socket.on('move', function(data) {
		console.log("what is in" + data);
	});
	// handle taking turns
	if (won !== true && draw !== true) {
			if (clientNo === 1) {
				io.to(roomName).emit('whoseTurn',  "p1");
			} else if (clientNo === 2) {
				io.to(roomName).emit('whoseTurn', "p2");
			}
		}
	socket.on('disconnection', function() {
		console.log('the id of disconnecting socket '.purple + socket.id);		socket.leave(room);
	});
});
server.listen(port, function() {
	console.log('listening on port ' + port);
});


// 

