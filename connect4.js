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
	board : [[]], //board[column][row]
	numCols : 7,
	numRows : 6,
	numPiecesPlayed : 0, //Number of pieces in the game (divide by 2  and floow to get turn number)

	initBoard: function(){
		for(var i=0; i<this.numCols; i++) {
			this.board[i] = new Array(this.numRows);
		}
	},

	isValidMove: function(move) {
		//Check if selected column is full by seeing if there is a value in top row
		var validMove = (this.board[move.col][this.numRows-1] === undefined);
		console.log("validMove: " + validMove);
		return validMove;
	}
	
};

var view = {
	displayPiece : function(move) {		
		var playerClass = move.player + '-piece';
		var moveLocation = '#' + (model.numRows - move.row - 1) + move.col; //Convert row so on bottom
		console.log("moveLocation: " + moveLocation + ", playerClass: " + playerClass);
		
		$(moveLocation).addClass(playerClass);
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

	handleMove : function(move) {		
		//Find next free row in column
		var i = 0;
		while (model.board[move.col][i] !== undefined) i++;
		move.row = i;
		console.log("Next row in col " + move.col + ": " + move.row);

		//Inset piece into board array
		model.board[move.col][move.row] = move.player;
		
		//Update view
		view.displayPiece(move);
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

	//Initialize array
	model.initBoard();

	//Handle table cell click
	$('td').click(function() {

		//Check that game has not endede
		if (model.gameActive) {
			//Display a piece at that location (for testing)
			// view.displayPiece(this.id);
			
			//Create new moveObj
			var move = new moveObj(model.currentPlayer, this.id);
			
			//Check for valid move
			if (model.isValidMove(move)) {
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
	//Code in case row is needed
	// this.row = model.numRows - cellID[0] -1; //Flip row number so row 0 is at bottom
	this.col = cellID[1];
	console.log("Move: player: " + this.player + ", col: " + this.col);
	};


