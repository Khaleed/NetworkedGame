/*
Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali
*/

(function() {

    'use strict';
    // connect to socket.io
    var socket = io.connect('http://192.168.33.10:3000/'),
        // create game room
        room = window.location.pathname.split('/').pop(),
        user,
        whoseTurn,
        isMyTurn,
        startGame,
        moves = 0,
        won = false,
        draw = false,
        resetElem = document.getElementById('start-button'),
        boardElem = document.getElementById('game-board'),
        statusElem = document.getElementById('status'),
        squares = document.getElementsByClassName('square'),
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
    // emit room event once connected to socket.io
    socket.on('connect', function() {
        socket.emit('room', room);
    });
    // listen for player event and add players
    socket.on('player', function(data) {
        user = data;
        console.log("player event data: " + data);
        if (user === 1) {
            console.log('This is player ' + user + '.');
            statusUpdate("Share URL http://192.168.33.10:3000/tictactoe" + room);
        } else if (user === 2) {
            console.log('This is player ' + user + '.');
            addPlayer2('Player 2');
        }
    
    // listen for start event from server and update turn status
    socket.on('startGame', function(data) {
        startGame = data;
        console.log("game started boolean: " + startGame);
        if (startGame === true) {
            statusUpdate("Player1's turn");
        }
    });
    // listen for whoseTurn event from server and let players take turns
    socket.on('whoseTurn', function(data) {
        console.log("whoseTurn data: " + data);
        var turnStatus;
        // player 1 goes first
        whoseTurn = data;
        // as long as the game is not over
        if (won !== true && draw !== true) {
            // and whoseTurn is equal to player 1
            if (whoseTurn === user) {
                isMyTurn = true;
                turnStatus = 'Your turn';
                console.log('Player 1 turn : ' + isMyTurn);
            } else {
                isMyTurn = false;
                turnStatus = 'It"s player ' + whoseTurn + ' turn';
                console.log('Player 2 turn: ' + isMyTurn);
            }
            statusUpdate(turnStatus);
        }
    });
    // Find where other player went and place piece on board
    socket.on('updateGame', function(data) {
        console.log("What's in updateGame event data: " + data);
        var i;
        // if it's not my turn
        if (!isMyTurn) {
            if (data.user === 1) {
                data.board[data.position] = 'X';
            } else {
                data.board[data.position] = 'O';
            }
            // draw piece
            placePiece(data.board, data.position);
        }
    });
    socket.on('winStatus', function(data) {
        console.log("winStatus shows the outcome: " + data.won);
        if (data === 'draw') {
            alert('Draw game');
        } else if (data.won === "won") {
            if (data.player === 1) {
                alert("X wins");
                resetGame();
            } else {
                alert("O wins");
                resetGame();
            }
        }
    });
    // set of helper functions:-  
    function addPlayer2(userVal) {
        document.getElementById('player').innerHTML = userVal;
    }

    function statusUpdate(status) {
        statusElem.innerHTML = status;
    }
    // helper function to place X or O on board
    function placePiece(board, position) {
        squares[position].innerHTML = board[position];
    }

    function renderMove(sqElem, position, board) {
        if (whoseTurn === 1) {
            moves += 1;
            board[position] = "X";
            sqElem.innerHTML = board[position];
        } else {
            moves += 1;
            boardArr[position] = "O";
            sqElem.innerHTML = board[position];
        }
    }

    function isSquareAvailable(board, position) {
        return board[position] === undefined;
    }

    function resetGame() {
        var i, j;
        // clear the values stored in the board
        for (i = 0; i < boardArr.length; i += 1) {
            boardArr[i] = undefined;
        }
        // clear squares on board
        for (j = 0; j < squares.length; j += 1) {
            squares[j].innerHTML = "";
        }
    }
    // playmove
    function playMove(sqElem) {
        // get square value
        var sqVal = sqElem.innerHTML,
            // get position of a clicked square
            sqPos = sqElem.getAttribute("data-position");
        if (startGame && isMyTurn && sqVal === '' && isSquareAvailable(boardArr, sqPos)) {
            // draw move
            renderMove(sqElem, sqPos, boardArr);
            console.log("what is in board array?: " + boardArr);
            // emit move event with user, board, and square position
            socket.emit("move", {
                user: user,
                position: sqPos,
                moves: moves
            });
            console.log("how many valid moves" + moves);
        }
    }
    // avoid creating callback function inside loops
    function cb() {
        playMove(this);
    }
    // boardSquares event handler 
    for (var i = 0; i < squares.length; i += 1) {
        // add event listener to each square
        squares[i].addEventListener('click', cb);
    }
    // resetGame event handler
    resetElem.addEventListener('click', function() {
        resetGame();
    });
})();