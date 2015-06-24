/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {

    'use strict';
    // connect to socket.io
    var socket = io.connect('http://localhost:3000');
    // create game room
    var room = window.location.pathname.split('/').pop();
    var user;
    var takeTurn;
    var isMyTurn;
    var turnInfo;
    var startGame;
    var gameOver = false;
    var renderMove;
    var resetElem = document.getElementById('start-button');
    var boardElem = document.getElementById('game-board');
    var resultElem = document.getElementById('results');
    var statusElem = document.getElementById('status');
    var squares = document.getElementsByTagName('input');
    var xTurn = true;
    var gameOver = false;
    var boardArr = [];
    var winCombo = [
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
    // addPLayer function
    function addPlayer2(user) {
            var container = document.getElementById('player');
            container.innerHTML = user;
    }
    // listen for player event and add players
    socket.on('player', function(data) {
        user = data;
        if (user === 1) {
            console.log('This is player ' + user + '.');
            // share URL UI - implement later
        } else if (user === 2) {
            console.log('This is player ' + user + '.');
            addPlayer2('Player 2');
        }
    });
    // update turns
    function turnsUpdate() {
        turnInfo = "It's Player1's turn";
        statusElem.innerHTML = turnInfo;
    }
    // listen for start event from server and update turn status
    socket.on('startGame', function(data) {
        startGame = data;
        if (startGame === true) {
            // side-effect of player 1 turn
            turnsUpdate();
        }
    });
    // listen for takeTurn event from server and let players take turns
    socket.on('takeTurn', function(data) {
        takeTurn = data;
        // as long as the game is not over
        if (gameOver === !true) {
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
            // side effect of letting me whose turn it is
            turnsUpdate();
        }
    });
    // reset 
    function resetGame() {
        var elem, i, j;
        for (i = 0; i <= 8; i += 1) {
            boardArr[i] = null;
        }
        for (j = 0; j <= 8; j += 1) {
            squares[j].value = '';
        }
        moves = 0;
        gameOver = false;
        xTurn = true; // X is first player
        statusElem.innerHTML = '';
    }
    // initialise game
    function init() {
        // get elements
        var src;
        resetGame(); // reset game when game is first initialised
        // bind main event handlers to reset game amd click board        
        resetElem.onclick = function() {
                resetGame(); // clear board once reset button is clicked
            }
            // use bind method instead of writing var that =             boardElem.onclick = function (e) { // e is the event object passed as an argument
        e = e || event; // event sometimes available through the global variable event for IE
        src = e.boardElem || e.target; // event target is the object which the event is associated with - cross browser issue
        renderMove(boardArr, { // pass an object containing the element and its data-position to renderMove method
            position: src.getAttribute('data-position'),
            elem: src
        });
    }
    // check if square is free
    function isSquareAvailable(board, position) {
        return board[position] === null; // returns true if space is available
    }
    // check 3 rows, 3 columns and 2 diagonals using winCombo array
    function checkForWinningMove() {
        var i;
        for (i = 0; i < winCombo.length; i += 1) {
            if (boardArr[winCombo[i][0]] === boardArr[winCombo[i][1]] && boardArr[winCombo[i][1]] ===
                boardArr[winCombo[i][2]] && boardArr[winCombo[i][1]] !== null) {
                return true;
            }
        }
    }
    // all moves played
    function validMoves() {
        if (moves === 9) {
            return moves;
        }
    }
    // game is a draw
    function drawn() {
        // indices begin at 0
        if (validMoves() === 9) {
            alert('Draw game!');
            resetGame();
        }
    }
    // game is won
    function won(result) {
        result = checkForWinningMove();
        if (result === true) {
            if (xTurn === false) {
                alert('X wins!');
                resetGame();
            } else {
                alert('O wins!');
                resetGame();
            }
        }
    }
    // decide the game's outcome
    function isGameOver() {
        return won() || drawn();
    }
    // player clicks the squares
    function renderMove(board, square, squareElem, squarePos) {
        squareElem = square.elem;
        squarePos = square.position;
        // stop selecting a square that's already taken
        if (squareElem.value !== '') {
            return;
        }
        if (isSquareAvailable(board, squarePos) && gameOver !== true) { // check board array is null and game isn't over
            moves += 1; // increment game move
            board[squarePos] = xTurn ? 'X' : 'O';
            xTurn = !xTurn;
            squareElem.value = board[squarePos]; // udpate UI
            turnsUpdate();
        }
        isGameOver();
    }
})();