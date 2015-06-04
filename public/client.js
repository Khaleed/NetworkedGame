/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {

    'use strict';
    var socket = io.connect("http://localhost:3000"),
        // connect to socket.io
        socket = io.connect("http://localhost:3000"),
        // create game room
        room = window.location.pathname.split("/").pop(),
        user,
        takeTurn,
        isMyTurn,
        start;
    // once connected emit room event
    socket.on("connect", function() {
        socket.emit("room", room);
    });
    // addPLayer function
    function addPlayer2(user) {
            var container = document.getElementById("player");
            container.innerHTML = user;
        }
        // listen for player event and add players
    socket.on("player", function(data) {
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
    socket.on("start", function(data) {
        start = start;
        if (start === true) {
            gameBoard.turnsUpdate();
            console.log("game has started" + gameBoard.turnsUpdate());
        }
    });
    // listen for takeTurn event and let players take turns
    socket.on("takeTurn", function(data) {
        takeTurn = data;
        // as long as the game is not over
        if (gameBoard.gameOver === !true) {
            // and takeTurn is equal to player 1
            if (takeTurn === user) {
                isMyTurn = true;
                console.log("Player 1 turn : " + isMyTurn);
            } else {
                isMyTurn = false;
                console.log("Player 1 turn " + isMyTurn);
            }
        }
    });
    // listen for render event and update moves
    

    // current function constructor for NodeTacToe
    var NodeTacToe = function() {
        this.init(); // constructor invocation method - this bound to the new object 
    };
    // this is the prototype object associated with the above function constructor 
    NodeTacToe.prototype = {
        // set initial game state
        boardElem: null,
        resetElem: null,
        resultElem: null,
        statusElem: null,
        moves: 0,
        xTurn: true,
        gameOver: false,
        boardArr: [],
        winCombo: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        resetGame: function() {            var elem, i, j;
            for (i = 0; i <= 8; += 1) {
                this.boardArr[i] = null; // set all values of bad array to null
            }
            for (j = 0; j <= 8;  += 1) {
                this.squares[j].value = ""; // clear the board I
            }
            this.moves = 0; // current move incrementor
            this.gameOver = false;
            this.xTurn = true; // X is first player
            this.statusElem.innerHTML = "";
        },

        init: function() {
            // get elements
            var src;
            this.resetElem = document.getElementById("start-button");
            this.boardElem = document.getElementById("game-board");
            this.resultElem = document.getElementById("results");
            this.statusElem = document.getElementById("status");
            this.squares = document.getElementsByTagName("input");
            this.resetGame(); // reset game when game is first initialised
            // bind main event handlers to reset game amd click board        
            this.resetElem.onclick = function() {
                this.resetGame(); // clear board once reset button is clicked
            }.bind(this); // inner function's this now bounded to the this variable of the outer function 
            // use bind method instead of writing var that = this
            this.boardElem.onclick = function(e) { // e is the event object passed as an argument
                e = e || event; // event sometimes available through the global variable event for IE
                src = e.boardElem || e.target; // event target is the object which the event is associated with - cross browser issue
                this.renderMove(this.boardArr, { // pass an object containing the element and its data-position to renderMove method
                    position: src.getAttribute("data-position"),
                    elem: src
                });
            }.bind(this);
        },

        isSquareAvailable: function(board, position) {
            return board[position] === null; // returns true if space is available
        },

        turnsUpdate: function() {
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O");
        },

        checkForWinningMove: function() { // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] ===
                    this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) {
                    return true;
                }
            }
        },

        validMoves: function() {
            if (this.moves === 9) {
                return this.moves;
            }
        },

        drawn: function() {
            // indices begin at 0
            if (this.validMoves() === 9) {
                alert("Draw game!");
                this.resetGame();
            }
        },

        won: function(result) {
            result = this.checkForWinningMove();
            if (result === true) { // if there is a winner
                if (this.xTurn === false) { // decide if X won or else O won
                    alert("X wins!");
                    this.resetGame();
                } else {
                    alert("O wins!");
                    this.resetGame();
                }
            }
        },

        isGameOver: function() {
            return this.won() || this.drawn(); // decide the game's outcome
        },

        renderMove: function(board, square, squareElem, squarePos) { // player clicks the squares
            squareElem = square.elem;
            squarePos = square.position;
            // stop selecting a square that's already taken
            if (squareElem.value !== "") {
                return;
            }
            if (this.isSquareAvailable(board, squarePos) && this.gameOver !== true) { // check board array is null and game isn't over
                this.moves += 1; // increment game move
                board[squarePos] = this.xTurn ? "X" : "O";
                this.xTurn = !this.xTurn;
                squareElem.value = board[squarePos]; // udpate UI
                this.turnsUpdate();
            }
            this.isGameOver();
        }
    };
    var gameBoard = new NodeTacToe(); // create a new instance of the GameBoard
})();