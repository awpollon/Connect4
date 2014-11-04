/**
 * @author Aaron Pollon
 */

$(document).ready(function() {
	view.displayPiece('00', true);
});

var model = {
	redTurn : true,
	board : []

};

var view = {
	displayPiece: function(location, isRed) {
		var playerClass = 'red-piece';
		if(!isRed) playerClass = 'black-piece';
		$('#' + location).addClass(playerClass);
	}
};

var controller = {
	
};

