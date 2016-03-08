/*
Server-Side Game State JavaScript for Networked TicTacToe
Author: Khalid Omar Ali
*/

function GameState() {
	var self = this;

	self.board = new Array(9);
	self.whoseTurn = 0;
	self.tie = false;
	self.moves = 0;
	self.won = false;
	self.game = undefined;

	self.MAX_PLAYERS = 2;
	self.WIN_COMBO = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

  var playerQueue = [];

	self.resetBoard = function() {
		self.board = new Array(9);
	};

  self.getPlayerNoFromQueue = function(id) {
		if (typeof id === "undefined") {
      console.log("id undefined in getPlayerNoFromQueue fn");
			return false;
		}
    var index = playerQueue.indexOf(id);
		if (index === -1) {
      console.log("negative index in getPlayerNoFromQueue fn");
			return false;
		}
		return index;
	};

  self.addPlayerToQueue = function(id) {
		// defensive check
		if (typeof id === "undefined") {
      console.log("id undefined in addPlayerToQueue fn");
			return false;
		}
		// fail quick test
    if (playerQueue.length === self.MAX_PLAYERS) {
      console.log("playerQueue length equal to MAX_PLAYERS in addPlayerToQueue fn");
			return false;
		}
    playerQueue.push(id);
		return true;
	};

  self.deletePlayerFromQueue = function(id) {
		if (typeof id === "undefined") {
      console.log("id undefined in deletePlayerFromQueue fn");
			return false;
		}
    if (playerQueue.length === 0) {
      console.log("playerQueue length equal to 0 in playerQueue fn");
			return false;
		}
    var index = playerQueue.indexOf(id);
    playerQueue.splice(index, 1);
		return true;
	};

	self.isMoveValid = function(pos) {
		console.log('board: ', self.board, 'pos: ', pos, ' === ', self.board[pos] === undefined);
		return self.board[pos] === undefined;
	};

}

module.exports = GameState;
