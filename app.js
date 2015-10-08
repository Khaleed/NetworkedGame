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

var GameState = require('./gamestate'),
	gamestate = new GameState();
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
	socket.on('room', function(room) {
		gamestate.game = room;
		socket.join(gamestate.game);
		if (!gamestate.addPlayerToQue(socket.id)) {
			// already 2 players; gamestate.game full; return
		}
		// emit room status and start gamestate.game events to client
		if (gamestate.getPlayerNoFromQue(socket.id) === 0) {
			io.to(socket.id).emit('roomStatus', {
				player: 0,
				status: "wait"
			});
		} else if (gamestate.getPlayerNoFromQue(socket.id) === 1) {
			io.to(socket.id).emit('roomStatus', {
				player: 1,
				status: "start"
			});
			io.to(gamestate.game).emit('startGame', true);
			io.to(gamestate.game).emit('whoseTurn', 0);
		}
	});
	socket.on('move', function(data) {
		// assume player 1 goes first
		console.log('move event data1: ' + data);
		if (gamestate.whoseTurn === gamestate.getPlayerNoFromQue(socket.id)) {
			console.log('move event data2: ' + data);
			if (gamestate.isMoveValid(data)) {
				console.log('move event data3: ' + data);
				// store player1 & 2 values in gamestate.game board	
				gamestate.board[data] = gamestate.whoseTurn === 0 ? 'X' : 'O';
				// acknowledge the player's move
				io.to(gamestate.game).emit('moveAcknowledged', {
					player: gamestate.whoseTurn,
					data: data
				});
				gamestate.whoseTurn = (gamestate.whoseTurn + 1) % 2;
				io.to(gamestate.game).emit('whoseTurn', gamestate.whoseTurn);
				gamestate.moves += 1;
			} else {
				io.to(gamestate.game).emit('invalidMove', gamestate.whoseTurn);
			}
		}
		// decide if gamestate.game has been gamestate.won
		var len = gamestate.WIN_COMBO.length;
		for (var i = 0; i < len; i += 1) {
			var board = gamestate.board;
			var winPos = gamestate.WIN_COMBO[i];
			if (board[winPos[0]] === board[winPos[1]] && board[winPos[1]] === board[winPos[2]] && board[winPos[1]] !== undefined) {
				if (board[winPos[1]] === 'X') {
					io.to(gamestate.game).emit('winStatus', 0);
				} else {
					io.to(gamestate.game).emit('winStatus', 1);
				}
				gamestate.won = true;
			}
		}
		if (gamestate.moves >= 9 && gamestate.won === false) {
			io.to(gamestate.game).emit('winStatus', 'tie');
			gamestate.tie = true;
		}
	});
	// listen for restart from client and reset the gamestate.game
	socket.on('restart', function() {
		if (gamestate.won === true || gamestate.tie === true) {
			io.to(gamestate.game).emit('resetGame');
			gamestate.won = false;
			gamestate.resetBoard();
			gamestate.tie = false;
			gamestate.moves = 0;
			gamestate.whoseTurn = 0;
		}
	});
	socket.on('disconnect', function() {
		// player leaves the gamestate.game
		gamestate.deletePlayerFromQue(socket.id);
	});
});
server.listen(port, function() {
	console.log('listening on port ' + port);
});