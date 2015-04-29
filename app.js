// require express
var express = require("express");
// declare a new instance of express
var app = express();
// app supplied as arg to HTTP server
var server = require("http").Server(app);
// require path to handle file paths
var path = require("path");
// serve static files via express
app.use(express.static(path.join(__dirname, "public")));
var publicDir = "./public/";
// define route
app.get("/", function(req, res) {
	res.sendFile(publicDir + "index.html");
});
// require socket.io and pass server obj
var io = require("socket.io")(server);
// listen to port 3000 or whatever is in process.env.port 
var port = process.env.port || 3000;
server.on("listening", function() {
    console.log("OK, the server is listening ");
});
server.listen(port, function() {
	console.log("listening on port " + port);
});
io.on("connection", function (client) {
	console.log("socket.io connection established");
	// listen for events emitted from client
	socket.on("disconnect", function() {
		io.emit("user disconnected");
	});
});