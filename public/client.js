/*

Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali

*/

(function() {
    'use strict';
    // create a new socket instance 
    var socket = io.connect("http://localhost:3000");
    // get users to join the game by first getting elements
    var userWrapper = document.getElementById("user-wrapper"),
        userForm = document.getElementById("user-form"),
        userInput = document.getElementById("user-input"),
        userErr = document.getElementById("user-err"),
        userElem = document.getElementById("user-list"),
        gameWrapper = document.getElementById("game-wrapper");
    // once you connect to socket.io, emit room event and a room (arbitrary channel);
    socket.on("connect", function(room) {
        socket.emit("room", room);
    });
    // credit to Crockford for this bind function
    if (!Function.prototype.bind) {
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
    // add players to game
    userForm.addEventListener("submit", function(e) {
        // work around for IE
        e = e || event;
        // prevent default hebaviour of form
        e.preventDefault();
        socket.emit("join", userInput.value, function(isNameAvailable) {
            // if callback from server is true 
            if (isNameAvailable) {
                // hide user input area
                userWrapper.style.display = "none";
                // start game
                gameWrapper.style.display = "block";
                // if name is already taken
            } else {
                // handle error
                userErr.innerHTML = "Name not available, please select another name!";
            }
            // clear user input
            userInput.value = "";
        });
    });

    function addPlayers(data) {
            var i, str = "",
                len = data.length;
            for (i = 0; i < len; i += 1) {
                str += data[i] + "</br>";
            }
            userElem.innerHTML = str;
        }
    // listen for player names and display
    socket.on("players", function(data) {
        addPlayers(data);
    });
    /*
        // identify player
        socket.on("player", function(player) {
            if (player === 1 && player === 2) {
                console.log("game started, this is player " + player + ".");
            }
        });
    */
    // remove players upon disconnection from socket
    socket.on("disconnected", function(data) {
        addPlayers(data);
    });

})();