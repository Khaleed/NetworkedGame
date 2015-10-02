/*
Client-Side JavaScript for Multi-PLayer TicTacToe
Author: Khalid Omar Ali
*/

(function() {

    'use strict';

    var express = require('express');
    // instance of express
    var app = express();
    // create a HTTP server
    var server = require('http').Server(app);
    // listen to TCP port in the env or 3000
    var port = process.env.port || 3000;
    var randomString = require('randomstring');
    // routes - when a get request is made
    // req and res objects extend Node HTTP objects
    app.get('/', function(req, res) {
        // redirect client to game room (using dynamic routing)
        var id = randomString.generate(7);
        res.redirect('/tictactoe/' + id);
    });
    // static route
    app.use();

    server.listen(function() {
        console.log('listening on port ' + port);
    });
}());