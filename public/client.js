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
        whoseTurn,
        isMyTurn,
        turnInfo,
        startGame,
        moves = 0,
        gameOver = false,
        resetElem = document.getElementById('start-button'),
        boardElem = document.getElementById('game-board'),
        resultElem = document.getElementById('results'),
        statusElem = document.getElementById('status'),
        squares = document.getElementsByTagName('input'),
        xTurn = true,
        winStatus,
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
    // addPLayer function
    function addPlayer2(userVal) {
        document.getElementById('player').innerHTML = userVal;
    }
    // update turns
    function turnsUpdate() {
        turnInfo = "It's Player1's turn";
        statusElem.innerHTML = turnInfo;
    }
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
    // listen for whoseTurn event from server and let players take turns
    socket.on('whoseTurn', function(data) {
        // player 1 goes first
        whoseTurn = data;
        // as long as the game is not over
        if (gameOver !== true) {
            // and whoseTurn is equal to player 1
            if (whoseTurn === user) {
                isMyTurn = true;
                turnInfo = turnsUpdate();
                console.log('Player 1 turn : ' + isMyTurn);
            } else {
                isMyTurn = false;
                turnInfo = 'It"s player ' + whoseTurn + ' turn';
                console.log('Player 2 turn ' + isMyTurn);
            }
            turnsUpdate();
        }
    });
    // draw move on board
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
    // check if square can be clicked
    function isSquareAvailable(board, position) {
        return board[position] === undefined;
    }
    // ensure that game started, it's the correct player turn
    // and that square is available
    // only then select the square and emit "move" event to server 
    function playMove(sqElem) {
        // set square value state
        var sqVal = sqElem.innerHTML,
            // get position of clicked square
            sqPos = sqElem.getAttribute("data-position");
        if (startGame && isMyTurn && sqVal === '' && isSquareAvailable(boardArr, sqPos)) {
            // draw move
            renderMove(sqElem, sqPos, boardArr);
            // emit move event with user and square position
            socket.emit("playMove", {
                user: user,
                board: boardArr,
                position: sqPos
            });
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
    // helper function to place X or O on board
    function placePiece(board, position) {
        var i;
        for(i = 0; i < squares.length; i += 1) {
            squares[i].innerHTML = board[position];
        }
    }
    // find where other player went and place piece on board
    socket.on('updateGame', function(data) {
        // if it's not
        if (!isMyTurn) {
            if (data.player === 1) {
                data.board[data.position] = 'X';
            } else {
                data.board[data.position] = 'O';
            }
            placePiece(data.board, data.position);
        }
    });
})();