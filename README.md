Networked Tic-Tac-Toe
=====================

Tictactoe 2 Player Game App originally written in vanilla JavaScript. It was re-written using Node.js, Socket.IO, Express for the back-end and native JavaScript for the front-end to better understand how networked games work.

Approach taken to networking the game is fairly simple. The game can only have two players. A client connects to the server, then the server creates a unique game room where two players can join to play the game. 

Smoothness of game plays and multiplayer mode is achieved by client-server architecture that ensures all the game's logic is undertaken by the server. The client doesn't know much and it's primary job is to update the UI. The server is the authority of the game states and each client runs the game locally. The client's input is sent to the server, and positions are updated whilst waiting for messages from the server (client-prediction). This makes the players' inputs feel more instantaneous and ensures that latency, cheat prevention, state management and load balancing are easier to deal with.





