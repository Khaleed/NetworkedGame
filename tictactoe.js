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

var TicTacToe = function() { //current function constructor
    this.init();
};

TicTacToe.prototype = { //gives instances of TicTacToe the below methods and values
    // every object linked to the prototype object which they inherit properties from
    boardElem: null, // empty elements by setting them to null 
    resultElem: null,
    startElem: null,
    statusElem: null,
    xTurn: true,
    gameOver: false,
    moves: 0,

    init: function() {
        // bind UI
        this.startElem = document.getElementById("start-button");
        this.boardElem = document.getElementById("game-board");
        this.resultElem = document.getElementById("results");
        this.statusElem = document.getElementById("status");
        // current binded events on starbutton and game board
        this.startElem.onclick = function() {
            this.startGame();
        }.bind(this);
        this.boardElem.onclick = function(e) {
            e = e || event;
            var source = e.boardElem || e.target;
            var id = source.getAttribute("id"); // get all btns 1...9 (query DOM and empty buttons when game is restarted)
            this.getSquareValues(id); // pass the id of the buttons clicked
        }.bind(this);
    },

    getSquareValues: function(square) {
        var squareValue = document.getElementById(square); // coming from events in init function
        if (squareValue.value !== "") { // if there is X or O 
            return;
        }
        if (squareValue !== "X" && squareValue !== "O" && this.gameOver !== true) { // stops a square being selected more than once
            // and stops clicking square when the game is over
            if (this.xTurn) {
                this.moves += 1;
                squareValue.value = "X"; // draw X on board
                this.xTurn = false; // then it is no longer the turn of X
                this.statusElem.innerHTML = "It is the turn of O";
            } else {
                this.moves += 1;
                squareValue.value = "O"; // if is O's turn, draw O
                this.xTurn = true; // it is now the turn of X
                this.statusElem.innerHTML = "It is the turn of X";
            }
        } else {
            return; // exit method 
        }
        if (this.moves === 9) { // check number of moves to see that 9 moves were made to complete a game
            this.gameOver = true;
        }
        this.checkForWinner();
    },

    checkForWinner: function() { // check all 8 winning combinations by holding them in an array
        var arr = []; // declare an array that holds all button values
        // put all values of all 9 squares into the array
        arr[1] = document.getElementById("btn1").value;
        arr[2] = document.getElementById("btn2").value;
        arr[3] = document.getElementById("btn3").value;
        arr[4] = document.getElementById("btn4").value;
        arr[5] = document.getElementById("btn5").value;
        arr[6] = document.getElementById("btn6").value;
        arr[7] = document.getElementById("btn7").value;
        arr[8] = document.getElementById("btn8").value;
        arr[9] = document.getElementById("btn9").value;
        // check if there are three Xs or three Os in a row  
        if (arr[1] === arr[2] && arr[2] === arr[3] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[4] === arr[5] && arr[5] === arr[6] && arr[4] !== "") {
            this.resultElem.innerHTML = arr[4] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[7] === arr[8] && arr[8] == arr[9] && arr[7] !== "") {
            this.resultElem.innerHTML = arr[7] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        }
        // check if there are three Xs or three Os in a column   
        else if (arr[1] === arr[4] && arr[4] === arr[7] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[2] === arr[5] && arr[5] === arr[8] && arr[2] !== "") {
            this.resultElem.innerHTML = arr[2] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[3] === arr[6] && arr[6] == arr[9] && arr[3] !== "") {
            this.resultElem.innerHTML = arr[3] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        }
        // check if there are three Xs or three Os in a diagonal
        else if (arr[7] === arr[5] && arr[5] === arr[3] && arr[7] !== "") {
            this.resultElem.innerHTML = arr[7] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[1] === arr[5] && arr[5] === arr[9] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (this.moves === 9) {
            this.resultElem.innerHTML = "draw";
            this.gameOver = true;
            return;
        } else {
            this.resultElem.innerHTML = " ";
            return;
        }
    },

    startGame: function(square) {
        var sqrArr = document.getElementsByTagName("input");
        for (var i = 0; i < sqrArr.length; i += 1) {
            sqrArr[i].value = "";
        }
        this.moves = 0;
        this.gameOver = false;
        this.getSquareValues();
    }
};
var playGame = new TicTacToe(); // new object which inherits from TicTacToe 