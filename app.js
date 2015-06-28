/*

Server Side JavaScript for TicTacToe
Author: Khalid Omar Ali

CLIENT/SERVER MODEL:
Each player is a client and all clients communicate with server

PLAYER JOINS: 
Each player exists as an object (with socket.id key) on the server
When a player logs on, they should be updated with the status
of each player on the server
Each player must join a room/lobby to ensure they start from
the same initial game state

GAME STATE: 
The game state exists on the server and mirrored on clients
When a player clicks, the client emits X or O to the server

Server updates state of each character in the 'world' and 
replies back with a packet containing the state of the 
character of player

Clients simply incorporate the updates from server

RESOURCE: 
Glenn Fiedler's What Every Programmer Needs to know
about Game Networking  

*/

(function() {

	'use strict';
	// require express
	var express = require('express');
	// declare a new instance of express
	var app = express();
	// app supplied as argument to HTTP server
	var server = require('http').Server(app);
	// require socket.io and pass server obj
	var io = require('socket.io')(server);
	// require randomString 
	var randomstring = require('randomstring');
	// require color.js for debugging
	var colors = require('colors');
	// curent tcp port
	var port;

	// routes
	app.get('/', function(req, res) {
		// create unique id
		var id = randomstring.generate(7);
		// redirect to dynamic route
		res.redirect('/tictactoe/' + id);
	});

	// dynamially create route for the unique game rooms
	// id is the placeholder used to name arguments 
	// part of the URL path
	app.get('/tictactoe/:id', function(req, res) {
		// current HTML file
		res.sendFile(__dirname + '/index.html');
	});

	// routes to static files
	app.use('/public', express.static('public'));

	// listen for connection event to socket.io
	io.on('connection', function(socket) {
		console.log('socket.io connection established'.red);
		// get elements
		var roomName;
		var whoseTurn;
		var start;
		var gameOver = false;
		var xTurn = true;
		var boardArr = [];
		var winCombo = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];
		var draw;
		var won;
		var whoWon;
		var moves;
		// join the socket's room
		// once client joins, we get a ping
		socket.on('room', function(room) {
			// join game room
			socket.join(room);
			// get elements to manipulate callback func
			var gameLobby;
			var clientsNo;
			var nameSpace = '/';
			roomName = room;
			// console debug
			console.log('connected to room: '.grey + roomName);
			// return an associative array of socket id properties
			// source: http://stackoverflow.com/questions/23858604/how-to-get-rooms-clients-list-in-socket-io-1-0
			gameLobby = io.nsps[nameSpace].adapter.rooms[roomName];
			// number of clients in game room
			clientsNo = Object.keys(gameLobby).length;
			console.log('how many people in room '.green + Object.keys(gameLobby));
			console.log('number of clients logged '.green + clientsNo);
			// get the first socket/player
			if (clientsNo === 1) {
				// emit to player1 socket
				// each socket automatically assigned an ID
				console.log("what is socket 1's id ".red + socket.id);
				io.to(socket.id).emit('player', 1);
			}
			// start game when 2 players are connected
			else if (clientsNo === 2) {
				// emit to player2 socket
				io.to(socket.id).emit('player', 2);
				console.log("what is socket 2's id ".red + socket.id);
				// emit to room that game can start
				io.to(roomName).emit('startGame', true);
				// emit to room that player 1 goes first
				io.to(roomName).emit('whoseTurn', 1);
			}
		});
		// listen for playMove and manipulate data obj
		// consisting of user & square
		socket.on("playMove", function(data) {
			var i;
			if (data.user === 1) {
				data.board[data.position] = 'X';
				console.log('player1 move'.green + data.board);
				io.to(roomName).emit('player1Move', data.board);
			} else {
				data.board[data.position] = 'O';
				console.log('player2 move'.green + data.board);
				io.to(roomName).emit('player2Move', data.board);
			}
			// check win state
			for (i = 0; i < winCombo.length; i += 1) {
				// check for 8 wiinning combos - 3 rows, 3 columns, and 2 diagonals
				if (boardArr[winCombo[i][0]] === boardArr[winCombo[i][1]] && boardArr[winCombo[i][1]] ===
					boardArr[winCombo[i][2]] && boardArr[winCombo[i][1]] === undefined) {
					io.to(roomName).emit('win', true);
				}
			}
			// Emit to opponent
			io.to(roomName).emit('update', data);
		});
	});
	// listening event handler for server
	server.on('listening', function() {
		console.log('OK, the server is listening '.yellow);
	});
	// listen to whatever is in process env or port 3000 
	port = process.env.port || 3000;
	server.listen(port, function() {
		console.log('listening on port '.yellow + port);
	});
})();