TicTacToe-Human
===============

Tictactoe 2 Player Game App originally written in vanilla JavaScript, refactored and updated with node.js, express.js, socket.io to enable real-time 2-player game. It was written as part of a small project to better understand how networked games work.  

Approach taken to networking the game is fairly simple. The game can only have two players. A client connects to the server, then the server creates a unique game room where two players can join to play the game. 

Smoothness of game plays and multiplayer mode is achieved by ensuring all the game's logic is undertaken by the server. The client doesn't know much and it's primary job is to update the UI. The server is the authority of the game states and each client runs the game locally. The client's input is sent to the server, and positions are updated whilst waiting for messages from server (client-prediction) to avoid latency issues. This makes the players' inputs feel more instantaneous. 



