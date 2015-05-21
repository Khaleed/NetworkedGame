/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {

    'use strict';

    // var socket = io.connect("http://localhost:3000");
    if (!Function.prototype.bind) { // credit to Crockford for this bind function  
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }

    var NodeTacToe = function() { // current function constructor 
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

        resetGame: function() {
            var elem, i, j;
            for (i = 0; i <= 8; i += 1) {
                this.boardArr[i] = null; // set all values of board array to null
            }
            for (j = 0; j <= 8; j += 1) {
                this.squares[j].value = ""; // clear the board UI
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

        checkForWinningMove: function() { // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] === 
                    this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) {
                    return true;
                } 
            }
        },

        validMoves: function(board) {
            var i, totalMoves = [];
            board = this.boardArr;
            for (i = 0; i < 10; i += 1) {
                if (board[i] !== null) {
                    totalMoves.push[i];
                }
                return totalMoves;
            }
        },

        drawn: function() {
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
                this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O");
            }
            this.isGameOver();
        }
    };
    var playNodeTacToe = new NodeTacToe(); // create a new instance of the GameBoard
})();