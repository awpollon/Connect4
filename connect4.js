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
	move : undefined, //Current move
	gameActive : true,
	animDone : true,
	redTurn : true, //Red always goes first. Update turn method assumes this
	currentPlayer : "Red",
	board : [[]], //board[column][row]
	numCols : 7,
	numRows : 6,
	numPiecesPlayed : 0, //Number of pieces in the game (divide by 2  and floow to get turn number)

	initBoard : function() {
		for (var i = 0; i < this.numCols; i++) {
			this.board[i] = new Array(this.numRows);
		}
	},

	isValidMove : function() {
		//Check if selected column is full by seeing if there is a value in top row
		var validMove = (this.board[this.move.col][this.numRows - 1] === undefined);
		console.log("validMove: " + validMove);
		return validMove;
	},

	checkForWin : function() {
		//Check horizontal
		if ((this.checkNumInRow(0, 1)) + ((this.checkNumInRow(0, -1))) >= 3)
			return true;
		//check vertical
		else if ((this.checkNumInRow(1, 0)) + ((this.checkNumInRow(-1, 0))) >= 3)
			return true;
		//Check diagonal1
		else if ((this.checkNumInRow(1, 1)) + ((this.checkNumInRow(-1, -1))) >= 3)
			return true;
		//Check diagonal2
		else if ((this.checkNumInRow(-1, 1)) + ((this.checkNumInRow(1, -1))) >= 3)
			return true;
		
else
			return false;
	},

	checkNumInRow : function(rowMod, colMod) {
		//Check in each direction for 4 in a row, modifiers specified direction
		var numOnSide = 0;
		var r = parseInt(this.move.row);
		var c = parseInt(this.move.col);

		while (numOnSide < 3) {
			r += parseInt(rowMod);
			c += parseInt(colMod);

			//Check for board boudnary
			if (r >= this.numRows || c >= this.numCols || c < 0 || r < 0)
				break;
			else if (this.board[c][r] === this.move.player) {
				console.log("Match found at col: " + c + ", row: " + r + "for " + this.move.player);
				numOnSide++;
			} else
				break;
		}
		console.log("Found " + numOnSide + " on side " + rowMod + ", " + colMod + " for " + this.move.player);

		return numOnSide;
	},
};

var view = {
	displayPiece : function() {
		var playerClass = model.move.player + '-piece';
		var moveLocation = '#' + (model.numRows - model.move.row - 1) + model.move.col;
		//Convert row so on bottom
		console.log("moveLocation: " + moveLocation + ", playerClass: " + playerClass);

		var moveColID = '#C' + model.move.col;
		var speedRatio = $(moveLocation).position().top / $("#50").position().top;
		var speed = 300 * speedRatio;
		console.log("speed: " + speed + ", speedRatio: " + speedRatio);

		//Make game temporary inactive to wait for animation to finish
		model.animDone = false;
		$(moveColID).addClass("piece");
		document.getElementById("play").volume = .2;
		document.getElementById("play").play();

		$(moveColID).addClass(playerClass).animate({
			top : $(moveLocation).position().top
		}, speed, function() {
			$(moveColID).css({
				top : 0
			});
			$(moveColID).removeClass(playerClass);
			$(moveColID).removeClass("piece");

			$(moveLocation).addClass("piece");
			$(moveLocation).addClass(playerClass);
			$(moveLocation).removeClass("hover");

			model.animDone = true;

			document.getElementById("play").load();
		});
	},

	setMsg : function(msg) {
		$('#msg').text(msg);
	},

	highlightCol : function(cell) {
		var colNum = cell.id[1];

		for (var i = 0; i < model.numRows; i++) {
			if (!$("#" + i + colNum).hasClass('piece')) {
				$("#" + i + colNum).addClass("hover");
			}
		}
	},

	removeHighlight : function(cell) {
		var colNum = cell.id[1];

		for (var i = 0; i < model.numRows; i++) {
			$("#" + i + colNum).removeClass("hover");
		}
	}
};

var controller = {
	endTurn : function() {
		//Increment number of pieces played
		model.numPiecesPlayed++;

		//Check for connect 4
		if (model.checkForWin()) {
			//Highlight winning pieces (using view method)
			//Display winning messege (using view method)
			view.setMsg(model.currentPlayer + " Wins!");
			//End game
			model.gameActive = false;
		}

		//If not connect4, check if board is full
		else if (this.isBoardFull()) {
			//Print draw messege
			view.setMsg("Board is full. It's a draw!");
			//End game
			model.gameActive = false;
		} else {
			//If game isn't over, switch to other player
			this.updateTurn();
			//Print turn msg
			view.setMsg(model.currentPlayer + '\'s turn.');
		}
	},

	handleMove : function() {
		//Find next free row in column
		var i = 0;
		while (model.board[model.move.col][i] !== undefined)
		i++;
		model.move.row = i;
		console.log("Next row in col " + model.move.col + ": " + model.move.row);

		//Inset piece into board array
		model.board[model.move.col][model.move.row] = model.move.player;

		//Update view
		view.displayPiece();
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
		if (model.gameActive && model.animDone) {
			//Display a piece at that location (for testing)
			// view.displayPiece(this.id);

			//Create new moveObj
			model.move = new moveObj(model.currentPlayer, this.id);

			//Check for valid move
			if (model.isValidMove()) {
				//Handle move
				controller.handleMove();

				//End the turn
				controller.endTurn();
			} else {
				view.setMsg("That column is full. Please select another.");
			}

		}
		//Else game is over, do nothing
	});

	$("#restart").click(function() {
		window.location.reload();
	});

	$("td").hover(function() {
		view.highlightCol(this);

	}, function() {
		view.removeHighlight(this);
	});

}

//Object to store move information
var moveObj = function(player, cellID) {
	this.player = player;
	//Code in case row is needed
	this.col = cellID[1];
	console.log("Move: player: " + this.player + ", col: " + this.col);
};

