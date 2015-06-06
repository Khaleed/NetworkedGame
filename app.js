/*

Server Side JavaScript for TicTacToe
Author: Khalid Omar Ali

CLIENT/SERVER MODEL:
Each player is a client and all clients communicate with server

PLAYER JOINS: 
Each player exists as an object on the server
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
	var express = require("express"),
		// declare a new instance of express
		app = express(),
		// app supplied as argument to HTTP server
		server = require("http").Server(app),
		// require socket.io and pass server obj
		io = require("socket.io")(server),
		// require randomString 
		randomstring = require("randomstring"),
		// curent tcp port
		port;

	// routes
	app.get("/", function(req, res) {
		// create unique id
		var id = randomstring.generate(7);
		// redirect to dynamic route
		res.redirect("/tictactoe/" + id);
	});

	// dynamially create route for the unique game rooms
	// id is the placeholder used to name arguments 
	// part of the URL path
	app.get("/tictactoe/:id", function(req, res) {
		// current HTML file
		res.sendFile(__dirname + "/index.html");
	});

	// routes to static files
	app.use("/public", express.static("public"));

	// listen for connection event to socket.io
	io.on("connection", function(socket) {
		console.log("socket.io connection established");
		// get elements
		var roomName,
			takeTurn,
			start;
		// join the socket's room
		// once client joins, we get a ping
		socket.on("room", function(room) {
			// join game room
			socket.join(room);
			var gameLobby, clientsNo, nameSpace = "/";
			roomName = room;
			console.log("connected to room: " + roomName);
			// return an associative array of socket id properties
			gameLobby = io.nsps[nameSpace].adapter.rooms[roomName];
			// number of clients in game room
			clientsNo = Object.keys(gameLobby).length;
			console.log(clientsNo);
			// get the first socket/player
			if (clientsNo === 1) {
				// emit to player1 socket
				// each socket automatically assigned ID
				console.log("what is socket 1's id " + socket.id);
				io.to(socket.id).emit("player", 1);
			}
			// start game when 2 players are connected
			else
			if (clientsNo === 2) {
				// emit to player2 socket
				io.to(socket.id).emit("player", 2);
				console.log("what is socket 2's id " + socket.id);
				// emit to room game can start
				io.to(roomName).emit("start", true);
				// emit to room whoseTurn, player1 is first
				io.to(roomName).emit("takeTurn", 1);
			}
		});
		socket.on("move", function(render) {
			io.to(roomName).emit("player move", render);
		});
	});

	// listening event handler for server
	server.on("listening", function() {
		console.log("OK, the server is listening ");
	});

	port = process.env.port || 3000;
	// listen to whatever is in process.env.port or port 3000 
	server.listen(port, function() {
		console.log("listening on port " + port);
	});
})();