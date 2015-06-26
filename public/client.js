/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {

    'use strict';
    // connect to socket.io
    var socket = io.connect('http://localhost:3000'),
        // create game room
        room = window.location.pathname.split('/').pop(),
        user,
        takeTurn,
        isMyTurn,
        turnInfo,
        startGame,
        gameOver = false,
        resetElem = document.getElementById('start-button'),
        boardElem = document.getElementById('game-board'),
        resultElem = document.getElementById('results'),
        statusElem = document.getElementById('status'),
        squares = document.getElementsByTagName('input'),
        xTurn = true,
        boardArr = [],
        winCombo = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
    // once connected emit room event
    socket.on('connect', function() {
        socket.emit('room', room);
    });
    // listen for player event and add players
    socket.on('player', function(data) {
        user = data;
        if (user === 1) {
            console.log('This is player ' + user + '.');
            alert("Share URL http://localhost:3000/tictactoe/" + room);
            // share URL UI - implement later
        } else if (user === 2) {
            console.log('This is player ' + user + '.');
            addPlayer2('Player 2');
        } else {
            return;
        }
    });
    // listen for start event from server and update turn status
    socket.on('startGame', function(data) {
        startGame = data;
        if (startGame === true) {
            // side-effect of player1 turn
            turnsUpdate();
        }
    });
    // listen for takeTurn event from server and let players take turns
    socket.on('takeTurn', function(data) {
        // player 1 goes first
        takeTurn = data;
        // as long as the game is not over
        if (gameOver !== true) {
            // and takeTurn is equal to player 1
            if (takeTurn === user) {
                isMyTurn = true;
                turnInfo = turnsUpdate();
                console.log('Player 1 turn : ' + isMyTurn);
            } else {
                isMyTurn = false;
                turnInfo = 'It"s player ' + takeTurn + ' turn';
                console.log('Player 2 turn ' + isMyTurn);
            }
            updateTurn();
        }
    });
    function cb() {
        playMove(this);
    } 
    // boardSquares event handler 
    for (var i = 0; i < squares.length; i += 1) {
        // add event listener to each square
        squares[i].addEventListener('click', cb);
    }
    // addPLayer function
    function addPlayer2(userVal) {
        document.getElementById('player').innerHTML = userVal;
    }
    // update turns
    function updateTurn() {
        turnInfo = "It's Player1's turn";
        statusElem.innerHTML = turnInfo;
    }
    // ensure that game started, it's the correct player turn
    // and that square is available
    // only then select the square and emit "move" event to server 
    function playMove(sqElem) {
        // set square value state
        var sqVal = sqElem.innerHTML,
            // get position of clicked square
            square  = sqElem.getAttribute("data-position"); 
        if (startGame && gameOver !== true && isMyTurn && sqVal === '') {
            // draw move
            renderMove(sqElem);
            // emit move event with user and square values
            socket.emit("playMove", {
                user: user,
                square: square
            });
        }
    }
    // draw move on board
    function renderMove(sqElem) {
        if (takeTurn === 1) {
            sqElem.innerHTML = "X";
        } else {
            sqElem.innerHTML = "O";
        }
    }
})();