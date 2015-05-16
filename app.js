/*

Server Side JavaScript for TicTacToe
Author: Khalid Omar Ali

CLIENT/SERVER MODEL:
Each player is a client and all clients communicate with server

PLAYER JOINS: 
Each player exists as an object on the server
When a player logs on, they should be updated with the status
of each player on the server
Each player must joinga room/lobby to ensure they start from
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

'use strict';

// require express
var express = require("express");
// declare a new instance of express
var app = express();
// app supplied as argument to HTTP server
var server = require("http").Server(app);
// require path to handle file paths
var path = require("path");
// require socket.io and pass server obj
var io = require("socket.io")(server);
// variable for automatching players to rooms
var tempRoom = "wait";
// require randomString, module for generating random strings
var randomString = require("randomstring");
// curent tcp port
var port;

// add static middleware serving files under public folder
app.use(express.static(path.join(__dirname, "public")));
// routes
app.get("/", function(req, res) {
	var gameId = randomstring.generate(5);
	res.redirect("/game/" + gameId);
});
app.get("/game/:id", function(req, res) {
	var publicDir = "./public/";
	res.sendFile(publicDir + "indext.html");
});

// listen for connection event to socket.io
io.on("connection", function(client) {
	console.log("socket.io connection established");
	// define states
	var players = [],
		// listen for when each client joins and emit
		client.on("join", function(name, callback) {
			// check if name isn't in players array
			if (players.indexOf(name) === -1) {
				// callback returns true to client o indicate player name is free
				callback(true);
				// put name as property of client's socket object
				client.username = name;
				// push name into player's array
				players.push(client.username);
				// emit player name 
				io.emit("players", players);
			} else {
				callback(false);
			}
		});
	// listen for join event and join rooms
	client.on("join", function(name) {
		if (tempRoom === "wait") {
			// assign username to temproom
			tempRoom = name;
			// join your room
			client.join(tempRoom);
			client.send("you, " + tempRoom);
		} else {
			// join the opponent's room
			client.join(tempRoom);
			client.send("Room, " + tempRoom);
		}
	});
	// listen for disconnect event and remove player name
	client.on("disconnect", function() {
		var startIndex = players.indexOf(client.username);
		if (client.username) {
			// remove from client.username from player's array
			players.splice(startIndex, 1);
			io.emit("disconnected", players);
		} else {
			return;
		}
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