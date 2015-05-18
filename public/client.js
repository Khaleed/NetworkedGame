/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {
        'use strict';
        // create a new socket instance 
        var socket = io.connect("http://localhost:3000"),
            // set game elements to null
            boardElem = null,
            resultElem = null,
            startElem = null,
            statusElem = null,
            xTurn = true,
            gameOver = false,
            moves = 0,
            // username elements
            userWrapper = document.getElementById("user-wrapper"),
            userForm = document.getElementById("user-form"),
            userInput = document.getElementById("user-input"),
            userErr = document.getElementById("user-err"),
            userElem = document.getElementById("user-list"),
            gameWrapper = document.getElementById("game-wrapper"),
            // board elements
            startElem = document.getElementById("start-button"),
            boardElem = document.getElementById("game-board"),
            squares = document.getElementsByTagName("input"),
            resultElem = document.getElementById("results"),
            statusElem = document.getElementById("status"),
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
        // add players to game
        userForm.addEventListener("submit", function(e) {
            // work around for IE
            e = e || event;
            // prevent default hebaviour of form
            e.preventDefault();
            socket.emit("addUser", userInput.value, function(isNameAvailable) {
                // if callback from server is true 
                if (isNameAvailable) {
                    // hide user input area
                    userWrapper.style.display = "none";
                    // start game
                    gameWrapper.style.display = "block";
                } else {
                    // handle error
                    userErr.innerHTML = "Name not available, please select another name!";
                }
                // clear user input
                userInput.value = "";
            });
        });
        // add users
        function addPlayers(data) {
                var i, str = "",
                    len = data.length;
                for (i = 0; i < len; i += 1) {
                    str += data[i] + "</br>";
                }
                userElem.innerHTML += str;
            }
            // listen for player names and display
        socket.on("players", function(data) {
            addPlayers(data);
        });
        // game board event handler
        boardElem.addEventListener("click", function(e) {
            var i, pos, src;
            e = e || event;
            src = e.boardElem || e.target;
            // get position of the square being clicked
            pos = src.getAttribute("data-position");
            // pass position to updateGame method
            updateGame(boardArr, {
                pos: src.getAttribute("data-position"),
                elem: src
            });
            // starGame
            function startGame() {
                    for (i = 0; i < squares.length; i += 1) {
                        squares[i].value = "";
                    }
                    moves = 0;
                    gameOver = false;
                    getSquareValues();
                }
                // check if square is available
            function isSquareAvailable(board, position) {
                    return board[position] === null;
                }
                // get total validMoves
            function validMoves(board) {
                    board = boardArr;
                    var totalMoves = [];
                    for (var i = 1; i < 10; i += 1) {
                        if (board[i] === null) {
                            totalMoves.push[i];
                        }
                        return totalMoves;
                    }
                }
                // check if the game is drawn
            function drawGame() {
                    if (totalMoves === 9) {
                        alert("Draw Game!");
                        gameOver = true;
                        startGame();
                    }
                }
                // check if there is a winner
            function checkForWin() {
                    // check 8 winning combo: 3 rows, 3 columns, and 2 diagonals
                    var i;
                    for (i = 0; i < winCombo.length; i += 1) {
                        if (boardArr[winCombo[i][0]] === boardArr[winCombo[i][1]] && boardArr[winCombo[i][1]] === boardArr[winCombo[i][2]] &&
                            boardArr[winCombo[i][1]] !== null) {
                            return true;
                        }
                    }
                }
            // update game status
            function getStatus() {
                    xTurn = true ? statusElem.innerHTML = "It's the turn of X" : statusElem.innerHTML = "It's the turn of O";
                }
            // check who won
            function won() {
                var result = checkForWin();
                if (result === true) {
                    if (xTurn === false) {
                        alert("X wins");
                        gameOver = true;
                        starGame();
                    } else {
                        alert("O wins");
                        gameOver = true;
                        starGame();
                    }
                }
            }
            // is it draw or win
            function decideGame() {
                    return draGame() || won();
                }
            // update game and emit
            function updateGame(board, square) {
                    var squareElem = square.elem,
                        squarePos = square.pos;
                    if (isSquareAvailable(board, squarePos)) {
                        console.log("is there a free square", board[squarePos] === null);
                        if (xTurn === true && this.gameOver !== true) {
                            moves += 1;
                            boardArr[squarePos] = "X";
                            xTurn = false;
                            getStatus();
                            decideGame();
                        } else {
                            moves += 1;
                            boardArr[squarePos] = "O";
                            xTurn = true;
                            getStatus();
                            decideGame();
                        }
                    }
                    else {
                        statusElem.innerHTML = "That square is taken!";
                    }
                }
            // start element event handler
            startElem.addEventListener("click", function() {
                socket.emit("start game", startGame());
            });
            // remove players upon disconnection from socket
            socket.on("disconnected", function(data) {
                addPlayers(data);
            });
        })();