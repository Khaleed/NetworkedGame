/*

Server Side JavaScript for TicTacToe
Author: Khalid Omar Ali

CLIENT/SERVER MODEL:

Each player is a client and all clients communicate with the server

PLAYER JOINS: 

Each player must join a room/lobby to ensure they start from 
the same initial game state. Each player that exists has socket.id key

GAME STATE: 

When a player clicks, the client emits position of move to the server
Server updates state of each character in the 'world' and 
replies back with a packet containing the state of the 
character of a player and the client simply ties. 
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
// global game variables
var playerQue = [];
var MAX_PLAYERS = 2;
var board = new Array(9);
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
var whoseTurn = 0;
// states
var won = false;
var tie = false;
var moves = 0;
var game;
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
function resetBoard() {
	board = new Array(9);
}

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
	return index;
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
	var index = playerQue.indexOf(id);
	playerQue.splice(index, 1);
	return true;
}

function isMoveValid(board, pos) {
	console.log('board: ',board,'pos: ',pos,' === ',board[pos] === undefined);
	return board[pos] === undefined;
}
// start using socket.io
io.on('connection', function(socket) {
	socket.on('room', function(room) {
		game = room;
		socket.join(game);
		if (addPlayerToQue(socket.id)) {
			console.log('adding player to que with socket id '.yellow);
		} else {
			console.log('error message on addPlayerToQue'.yellow);
		}
		// emit room status and start game events to client
		if (getPlayerNoFromQue(socket.id) === 0) {
			io.to(socket.id).emit('roomStatus', {
				player: 0,
				status: "wait"
			});
		} else if (getPlayerNoFromQue(socket.id) === 1) {
			io.to(socket.id).emit('roomStatus', {
				player: 1,
				status: "start"
			});
			io.to(game).emit('startGame', true);
			io.to(game).emit('whoseTurn', 0);
		}
	});
	socket.on('move', function(data) {
		// assume player 1 goes first
		console.log('move event data1: ' + data);
		if (whoseTurn === getPlayerNoFromQue(socket.id)) {
			console.log('move event data2: ' + data);
			if (isMoveValid(board, data)) {
				console.log('move event data3: ' + data);
				// store player1 & 2 values in game board	
				board[data] = whoseTurn === 0 ? 'X' : 'O';
				// acknowledge the player's move
				io.to(game).emit('moveAcknowledged', {
					player: whoseTurn,
					data: data
				});
				whoseTurn = (whoseTurn + 1) % 2;
				io.to(game).emit('whoseTurn', whoseTurn);
				moves += 1;
			} else {
				io.to(game).emit('invalidMove', whoseTurn);
			}
		}
		// decide if game has been won
		var len = WIN_COMBO.length;
		for (var i = 0; i < len; i += 1) {
			if (board[WIN_COMBO[i][0]] === board[WIN_COMBO[i][1]] && board[WIN_COMBO[i][1]] === board[WIN_COMBO[i][2]] && board[WIN_COMBO[i][1]] !== undefined) {
				if (board[WIN_COMBO[i][1]] === 'X') {
					io.to(game).emit('winStatus', 0);
				} else {
					io.to(game).emit('winStatus', 1);
				}
				won = true;
			}
		}
		if (moves >= 9 && won === false) {
			io.to(game).emit('winStatus', 'tie');
			tie = true;
		}
	});
	// listen for restart from client and reset the game
	socket.on('restart', function() {
		if (won === true || tie === true) {
			io.to(game).emit('resetGame');
			won = false;
			resetBoard();
			tie = false;
			moves = 0;
			whoseTurn = 0;
		}
	});
	socket.on('disconnection', function() {
		// player leaves the game
		socket.leave(game);
		deletePlayerFromQue(socket.id);
		console.log('socket ' + socket.id + ' deleted ' + deletePlayerFromQue(socket.id));
	});
});
server.listen(port, function() {
	console.log('listening on port ' + port);
});