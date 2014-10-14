if (!Function.prototype.bind) { // credit to Crockford for bind method
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

var TicTacToe = function() { // current function object constructor 
    this.init();
};

TicTacToe.prototype = { // deposit all methods and states in here

    boardElem: null,  // bind UI
    resetElem: null,     
    statusElem: null, 
    resultElem: null,
    
    xTurn: true, // bind game properties/states
    gameOver: false,
    boardArr: [],
    winArr: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
], 

    init: function() { // initialise all elements & bind events
        var i, position, source, target;
        this.boardElem: document.getElementById("game-board"), // bind UI
        this.resetElem: document.getElementById("reset"),
        this.statusElem: document.getElementById("status"),
        this.resultElem: document.getElementById("results"),
    
        document.getElementById("reset").onclick = function () {
        this.reset(); // event handler for clicking reset button
        }.bind(this);
        this.boardElem.onclick = function (e) { // event handler for clicking squares
            e = e || event; // e is event initiliased when invoked  
            source = e.boardElem || e.target; // target is originating element
            this.updateGame({postion: source.getAttribute("data-position")});       
        }.bind(this);

    },

    reset: function() { // reset game
        for (i = 0; i < this.boardArr.length; i +=1) {
            this.boardArr[i] = null;
        }

    },

    checkForWinner: function() { // check if there is a winning move

    },

    updateGame: function(position) { // update game state 

    },

    updateUI: function() { // update game UI

    }


};

var myTicTacToe = new TicTacToe(); // initialise new instance of TicTacToe