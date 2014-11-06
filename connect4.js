/**
 * @author Aaron Pollon
 */

$(document).ready(function() {
	//Test code
	// view.displayPiece('00', true);
	// view.setMsg('Testing msg');
	//End test code

	init();
});

var model = {
	gameActive : true,
	redTurn : true, //Red always goes first. Update turn method assumes this
	currentPlayer : "Red",
	board : [[]],
	numCols : 7,
	numRows : 6,
	numPiecesPlayed : 0, //Number of pieces in the game (divide by 2  and floow to get turn number)

	validMove: function(cellID) {
		//Check
	}
};

var view = {
	displayPiece : function(location) {
		var playerClass = 'red-piece';
		if (!model.redTurn)
			playerClass = 'black-piece';
		$('#' + location).addClass(playerClass);
	},

	setMsg : function(msg) {
		$('#msg').text(msg);
	}
};

var controller = {
	endTurn : function() {
		//Increment number of pieces played
		model.numPiecesPlayed++;

		//Check for connect 4
		if (this.checkForWin()) {
			//Highlight winning pieces (using view method)
			//Display winning messege (using view method)
			view.setMsg(model.currentPlayer + " Wins!");
			//End game (controller method)
		}

		//If not connect4, check if board is full
		else if (this.isBoardFull()) {
			//Print draw messege
			view.setMsg("Board is full. It's a draw!");
			//End game
		} else {
			//If game isn't over, switch to other player
			this.updateTurn();
			//Print turn msg
			view.setMsg(model.currentPlayer + '\'s turn.');
		}
	},

	checkForWin : function() {
		//Scan game board for 4 in a row, return true if foudn

		//Delete me
		return false;
	},

	isBoardFull : function() {
		console.log("numPiecesPlayed: " + model.numPiecesPlayed);
		return ((model.numPiecesPlayed) === (model.numCols * model.numRows));
	},

	updateTurn : function() {
		//Toggle the turn
		model.redTurn = !model.redTurn;
		if (model.redTurn) {
			model.currentPlayer = "Red";
		} else {
			model.currentPlayer = "Black";
		}
	}
};

function init() {
	//Set welcome messege
	view.setMsg("Welcome to Connect 4! Red goes first. Enjoy!");

	//Handle table cell click
	$('td').click(function() {

		//Check that game has not endede
		if (model.gameActive) {
			//Display a piece at that location (for testing)
			// view.displayPiece(this.id);
			
			//Create new moveObj
			var move = new moveObj(model.currentPlayer, this.id);
			
			//Check for valid move
			if (model.validMove(move)) {
				//Handle move
				controller.handleMove(move);
				
				//End the turn
				controller.endTurn();
			}
			else {
				view.setMsg("That column is full. Please select another.");
			}

		}
		//Else game is over, do nothing
	});
}

//Object to store move information
var moveObj = function(player, cellID){
	this.player = player;
	this.row = model.numRows - cellID[0] -1; //Flip row number so row 0 is at bottom
	this.col = cellID[1];
	console.log("Move: player: " + this.player + ", row: " + this.row + ", col: " + this.col);
};


