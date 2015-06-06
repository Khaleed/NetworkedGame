/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function () {

    'use strict';
    var socket = io.connect("http://localhost:3000"),
    // connect to socket.io
    socket = io.connect("http://localhost:3000"),
    // create game room
    room = window.location.pathname.split("/").pop(),
    user,
    takeTurn,
    isMyTurn,
    start,
    gameOver = false,
    renderMove,
    boardElem = null,
    resetElem = null,
    resultElem = null,
    statusElem = null,
    moves = 0,
    xTurn = true,
    gameOver = false,
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
    socket.on("connect", function () {
        socket.emit("room", room);
    });
    // addPLayer function
    function addPlayer2(user) {
        var container = document.getElementById("player");
        container.innerHTML = user;
    }
    // listen for player event and add players
    socket.on("player", function (data) {
        user = data;
        if (user === 1) {
            console.log("This is player " + user + ".");
            // share URL
        } else if (user === 2) {
            console.log("This is player " + user + ".");
            addPlayer2("Player 2");
        }
    });
    // listen for start event and update turn status
    socket.on("start", function (data) {
        start = start; 
        if (start === true) {
            init();
            turnsUpdate();     
        }
    });
    // listen for takeTurn event and let players take turns
    socket.on("takeTurn", function (data) {
        takeTurn = data;
        // as long as the game is not over
        if(gameOver === !true) {
            // and takeTurn is equal to player 1
            if(takeTurn === user) {
                isMyTurn = true;
                console.log("Player 1 turn : " + isMyTurn);
            } else {
                isMyTurn = false;
                console.log("Player 2 turn " + isMyTurn);
            }
        }
    });
    // emit player's move
    socket.emit("move", renderMove());
    // listen for player move and update
    socket.on("player move", function (data) {
        if(isMyTurn === true) {
            data();
        }
    }
    // reset 
    function resetGame() {
        var elem, i, j;
        for (i = 0; i <= 8; i += 1) {
            boardArr[i] = null; // set all values of board array to null
        }
        for (j = 0; j <= 8; j += 1) {
            squares[j].value = ""; // clear the board UI
        }
        moves = 0; // current move incrementor
        gameOver = false;
        xTurn = true; // X is first player
        statusElem.innerHTML = "";
    }
    // initialise game
    function init() {
        // get elements
        var src;
        resetElem = document.getElementById("start-button");
        boardElem = document.getElementById("game-board");
        resultElem = document.getElementById("results");
        statusElem = document.getElementById("status");
        squares = document.getElementsByTagName("input");
        resetGame(); // reset game when game is first initialised
        // bind main event handlers to reset game amd click board        
        resetElem.onclick = function() {
                resetGame(); // clear board once reset button is clicked
            }
            // use bind method instead of writing var that =             boardElem.onclick = function (e) { // e is the event object passed as an argument
        e = e || event; // event sometimes available through the global variable event for IE
        src = e.boardElem || e.target; // event target is the object which the event is associated with - cross browser issue
        renderMove(boardArr, { // pass an object containing the element and its data-position to renderMove method
            position: src.getAttribute("data-position"),
            elem: src
        });
    }
    // check if square is free
    function isSquareAvailable(board, position) {
        return board[position] === null; // returns true if space is available
    }
    // update turns
    function turnsUpdate() {
        statusElem.innerHTML = "It's the turn of " + (xTurn ? "X" : "O");
    }
    function checkForWinningMove() { // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
        var i;
        for (i = 0; i < winCombo.length; i += 1) {
            if (boardArr[winCombo[i][0]] === boardArr[winCombo[i][1]] && boardArr[winCombo[i][1]] ===
                boardArr[winCombo[i][2]] && boardArr[winCombo[i][1]] !== null) {
                return true;
            }
        }
    }
    function validMoves () {
        if (moves === 9) {
            return moves;
        }
    }
    function drawn() {
        // indices begin at 0
        if (validMoves() === 9) {
            alert("Draw game!");
            resetGame();
        }
    }
    function won(result) {
        result = checkForWinningMove();
        if (result === true) { // if there is a winner
            if (xTurn === false) { // decide if X won or else O won
                alert("X wins!");
                resetGame();
            } else {
                alert("O wins!");
                resetGame();
            }
        }
    }
    function isGameOver () {
            return won() || drawn(); // decide the game's outcome
    }
    function renderMove (board, square, squareElem, squarePos) { // player clicks the squares
            squareElem = square.elem;
            squarePos = square.position;
            // stop selecting a square that's already taken
            if (squareElem.value !== "") {
                return;
            }
            if (isSquareAvailable(board, squarePos) && gameOver !== true) { // check board array is null and game isn't over
                moves += 1; // increment game move
                board[squarePos] = xTurn ? "X" : "O";
                xTurn = !xTurn;
                squareElem.value = board[squarePos]; // udpate UI
                turnsUpdate();
            }
            isGameOver();
        }
})();