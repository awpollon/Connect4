/**
 * @author Aaron Pollon
 */

$(document).ready(function() {
	view.displayPiece('00', true);
	view.setMsg('Testing msg');
	
	init();
});

var model = {
	redTurn : true,
	board : []

};

var view = {
	displayPiece: function(location) {
		var playerClass = 'red-piece';
		if(!model.redTurn) playerClass = 'black-piece';
		$('#' + location).addClass(playerClass);
	},
	
	setMsg: function(msg) {
		$('#msg').text(msg);
	}
};

var controller = {
	endTurn: function() {
		
		this.updateTurn();
	},
	
	checkForWin: function() {
		
	},
	
	
	updateTurn: function() {
		//Toggle the turn
		model.redTurn = !model.redTurn;
		if(model.redTurn) {
			view.setMsg('Red\'s Turn');
		}
		else view.setMsg('Black\'s Turn');
	}
};

function init() {
	$('td').click(function() {
			view.displayPiece(this.id);
			controller.endTurn();
		});
}

