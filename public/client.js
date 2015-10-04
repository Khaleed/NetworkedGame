/*
Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali
*/
'use strict';

(function() {
    // grab main elements
    var socket = io.connect('http://192.168.33.10:3000/'),
        board = document.getElementById('game-board'),
        squareElem = document.getElementsByClassName('square'),
        statusElem = document.getElementById('status'),
        room = window.location.pathname.split('/').pop();
        console.log(room);
        // emit room event to server
        socket.once('connect', function() {
            socket.emit('room', room);
        });
        
}());