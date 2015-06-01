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
		// require path to handle file paths
		path = require("path"),
		// require socket.io and pass server obj
		io = require("socket.io")(server),
		// require randomString
		randomstring = require("randomstring"),
		// curent tcp port
		port,
		// public directory
		publicDir;
	// routes
	app.get("/", function(req, res) {
		// create unique id
		var id = randomstring.generate(7);
		// redirect to dynamic route
		res.redirect("/game/" + id);
	});
	// dynamially create route for the unique game rooms
	app.get("/game/:id", function(req, res) {
		res.sendFile(__dirname + "/public/index.html");
	});
	// routes to static files
	app.use("public", express.static("public"));
	// listen for connection event to socket.io
	io.on("connection", function(client) {
		console.log("socket.io connection established");

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
})()