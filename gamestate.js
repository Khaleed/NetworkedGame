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

	var playerQue = [];

	self.resetBoard = function() {
		self.board = new Array(9);
	};

	self.getPlayerNoFromQue = function(id) {
		if (typeof id === "undefined") {
			console.log("id undefined in getPlayerNoFromQue fn");
			return false;
		}
		var index = playerQue.indexOf(id);
		if (index === -1) {
			console.log("negative index in getPlayerNoFromQue fn");
			return false;
		}
		return index;
	};

	self.addPlayerToQue = function(id) {
		// defensive check
		if (typeof id === "undefined") {
			console.log("id undefined in addPlayerToQue fn");
			return false;
		}
		// fail quick test
		if (playerQue.length === self.MAX_PLAYERS) {
			console.log("playerQue length equal to MAX_PLAYERS in addPlayerToQue fn");
			return false;
		}
		playerQue.push(id);
		return true;
	};

	self.deletePlayerFromQue = function(id) {
		if (typeof id === "undefined") {
			console.log("id undefined in deletePlayerFromQue fn");
			return false;
		}
		if (playerQue.length === 0) {
			console.log("playerQue length equal to 0 in playerQue fn");
			return false;
		}
		var index = playerQue.indexOf(id);
		playerQue.splice(index, 1);
		return true;
	};

	self.isMoveValid = function(pos) {
		console.log('board: ', self.board, 'pos: ', pos, ' === ', self.board[pos] === undefined);
		return self.board[pos] === undefined;
	};

}

module.exports = GameState;