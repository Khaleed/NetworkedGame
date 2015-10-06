/*
Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali
*/

(function() {

    'use strict';

    // states
    var socket = io.connect('http://192.168.33.10:3000/'),
        room = window.location.pathname.split('/').pop(),
        player,
        whoseTurn,
        startGame;
    // elements
    var boardElem = document.getElementById('game-board'),
        squareElem = document.getElementsByClassName('square');
    // emit room event to server
    socket.once('connect', function() {
        socket.emit('room', room);
    });
    // receive from server room status and add players
    socket.on('roomStatus', function(data) {
        player = data.player;
        if (player === 1) {
            statusUpdate('Share URL:  192.168.33.10:3000/tictactoe/' + room);
        } else if (player === 2) {
            addPlayer2('Player 2');
        }
    });
    // receive from the server that the game can now start 
    // and show clients that is it player1 turn
    socket.on('startGame', function(data) {
        console.log('what is in the startGame data ' + data);
        startGame = data;
        if (startGame === true) {
            // player 1 always goes first
            statusUpdate("Player1's turn");
        }
    });
    // receive whoseTurn event from server and implement appropriate UI
    socket.on('whoseTurn', function(data) {
        console.log('whoseTurn data ' + data);
        var turnStatus;
        whoseTurn = data;
        if (whoseTurn === player) {
            turnStatus = 'Your Turn';
        } else {
            turnStatus = 'It is player' + whoseTurn + ' s turn';
        }
        statusUpdate(turnStatus);
    });
    // listen for move-acknowledged event and draw moves on board
    socket.on('move-acknowledged', function(data) {
        var response = data;
        if (response.player === 1) {
            document.getElementById('btn-' + response.data).innerHTML = "X";
        } else {
            document.getElementById('btn-' + response.data).innerHTML = "O";
        }
    });
    socket.on('winStatus', function(data) {
        console.log('winStatus is ' + data);
        if (data === 'draw') {
            statusUpdate("Draw - Cat's game!");
        } else {
            statusUpdate('Player ' + data + ' won');
        }
    });
    socket.on('resetGame', function(board) {
        for (var i = 0, len = board.length; i < len; i += 1) {
            squareElem[i].innerHTML = "";
        }
    });
    // playMove on the board
    function playMove(sqElem) {
        // get position of a clicked square
        var sqPos = sqElem.getAttribute('data-position');
        // emit move event to server with position of the board
        socket.emit('move', sqPos);
    }
    // game board event handler
    boardElem.addEventListener('click', function(e) {
        if (e.target.classList.contains('square')) {
            playMove(e.target);
        }
    });
    // UI helper functions
    function statusUpdate(status) {
        document.getElementById('status').innerHTML = status;
    }

    function addPlayer2(name) {
        document.getElementById('player').innerHTML = name;
    }
}());