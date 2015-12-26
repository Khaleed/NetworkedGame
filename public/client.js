/*
Client-Side JavaScript for Networked TicTacToe
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
        resetElem = document.getElementById('restart'),
        squareElem = document.getElementsByClassName('square');
    // emit room event to server
    socket.once('connect', function() {
        socket.emit('room', room);
    });
    // receive from server room status and add players
    socket.on('roomStatus', function(data) {
        player = data.player;
        if (player === 0) {
            statusUpdate('Share URL:  192.168.33.10:3000/tictactoe/' + room);
        } else if (player === 1) {
            addPlayer2('Player 2');
        }
    });
    // receive from the server that the game can now start 
    socket.on('startGame', function(startGame) {
        if (startGame) {
            // player 1 always goes first
            statusUpdate("Player1's turn");
        }
    });
    // receive whoseTurn event from server and implement appropriate UI
    socket.on('whoseTurn', function(whoseTurn) {
        console.log('whoseTurn data ' + whoseTurn);
        var turnStatus;
        var humanTurn = whoseTurn + 1;
        if (whoseTurn === player) {
            turnStatus = 'Your Turn';
        } else {
            turnStatus = 'It is Player' + humanTurn + "'s turn";
        }
        statusUpdate(turnStatus);
    });
    // listen for invalid moves
    socket.on('invalidMove', function(whoseTurn) {
        if (whoseTurn === player) {
            statusUpdate('Invalid move, try again!');
        }
    });
    // listen for move-acknowledged event and draw moves on board
    socket.on('moveAcknowledged', function(response) {
        if (response.player === 0) {
            document.getElementById('btn-' + response.data).innerHTML = "X";
        } else {
            document.getElementById('btn-' + response.data).innerHTML = "O";
        }
    });
    socket.on('winStatus', function(data) {
        var humanWin = data + 1; 
        if (data === 'draw') {
            statusUpdate("Draw - Cat's game!");
        } else {
            statusUpdate('Player ' + humanWin + ' won');
        }
    });
    socket.on('resetGame', function() {
        clearBoard();
    });
    // playMove on the board
    function playMove(sqElem) {
        // get position of a clicked square
        var sqPos = sqElem.getAttribute('data-position');
        // emit move event to server with position of the board
        socket.emit('move', sqPos);
    }

    function resetGame() {
        socket.emit('restart');
    }
    // helper function to clear the board
    function clearBoard() {
        for (var i = 0, len = squareElem.length; i < len; i += 1) {
            squareElem[i].innerHTML = "";
        }
    }
    // board event handler
    boardElem.addEventListener('click', function(e) {
        if (e.target.classList.contains('square')) {
            playMove(e.target);
        }
    });
    // resetGame event handler
    resetElem.addEventListener('click', function(e) {
        if (e.target.id === 'restart') {
            resetGame(e.target);
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