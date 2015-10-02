TicTacToe-Human
===============

Tictactoe 2 Player Game App originally written in vanilla JavaScript, refactored and updated with node.js, express.js, socket.io to enable real-time 2-player game. It was re-written as part of a small project at the Recurse Center to better understand how network games work.  

Smoothness of game plays and multiplayer mode is achieved by ensuring all the game's logic is undertaken by the server.The client simply mirrors the server-side. Server is the authority of the game states and the client runs the game locally. The client's input is sent to the server, and positions updated whilst waiting for messages from server (client-prediction) to avoid latency issues.

Approach taken to networking the game is fairly simple. The game can only have two players. A client connects to the server, then the server creates a unique game room where two players can join to play the game. 


