TicTacToe-Human
===============


Tictactoe 2 Player Game App originally written in vanilla JavaScript, updated using node.js, express.js, socket.io with minor tweaks


Node.js

Node.sj is easy-to-use, fast, powerful, and felixible platform built on Chrome's JavaScript runtime. It uses an event-driven, non-blocking I/O model


Express.js

Express is a minimal and flexible Node.js web app framework without obscuring Node features


Socket.io

Socket.io is a powerful and flexible server-side and client-side engine. It enables real-time bi-directional event-based communication and work most platforms, browsers or devices, focusing on realiability and speed


Multi-player Game

Smoothness of game plays and multiplayer mode is achieved by ensuring all the game's logic is undertaken by the server. The client simply mirrors the server-side. Server is the authority of the game states and the client runs the game locally. The client's input is sent to the server, and positions updated whilst waiting for messages from server (client-prediction) to avoid latency issues

Approach taken to networking the game is fairly simple. The game can only have two players. A client connects to the server, then the server creates a unique game room where two players can joint to play the game


