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
The game state exists on the server and mirrored on clients
When a player clicks, the client emits X or O to the server
Server updates state of each character in the 'world' and 
replies back with a packet containing the state of the 
character of a player
Clients simply incorporate the updates from server
RESOURCE: 
Glenn Fiedler's What Every Programmer Needs to know
about Game Networking  
*/

(function() {

	'use strict';

	

});