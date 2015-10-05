/*
Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali
*/

(function() {

    'use strict';

    // grab main elements
    var socket = io.connect('http://192.168.33.10:3000/'),
        boardElem = document.getElementById('game-board'),
        squareElem = document.getElementsByClassName('square'),
        room = window.location.pathname.split('/').pop(),
        player,
        startGame;
    // emit room event to server
    socket.once('connect', function() {
        socket.emit('room', room);
    });
    // receive from server status event and add players
    socket.on('status', function(data) {
        player = data;
        console.log("player event data: " + data);
        if (player === "p1") {
            statusUpdate("Share URL:  192.168.33.10:3000/tictactoe/" + room);
        } else if (player === "p2") {
            addPlayer2('Player 2');
        }
    });
    // receive from the server that the game can now start 
    // and show clients that is it p1 turn
    socket.on('startGame', function(data) {
        console.log("what's in the startGame data " + data);
        startGame = data;
        if (startGame === true) {
            // in a new game, player 1 goes first
            statusUpdate("p1's turn");
        }
    });
    // receive whoseTurn event from server and show
    // whose turn it is
    socket.on("whoseTurn", function(data) {
        console.log("whoseTurn's data " + data);
        var turnStatus;
        whoseTurn = data;
        if (whoseTurn === player) {
            turnStatus = 'Your Turn';
        } else {
            turnStatus = 'It is ' + whoseTurn + ' turn';
        }
        statusUpdate(turnStatus);
    });
    // playmove
    function playMove(sqElem) {
        // get position of a clicked square
        var sqPos = sqElem.getAttribute('data-position');
        socket.emit("move", {
            player: player,
            position: sqPos
        });
    }
    // game board event handler
    boardElem.addEventListener('click', function(e) {
        if (e.target.classList.contains('square')) {
            playmove(e.target);
        }
    });
    // UI functions
    function statusUpdate(status) {
        document.getElementById('status').innerHTML = status;
    }
    function addPlayer2(name) {
        document.getElementById('player').innerHTML = name;
    }
}());