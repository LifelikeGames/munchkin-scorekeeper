//Data object to hold all settings and player info
var data;

function initData() {
	data = {maxPlayers: 6, playerCount: 0, players: []};
	addPlayerToList(1);
	addPlayerToList(2);
}

//Creates a new player object within data and a row for the player list
function createPlayer(num) {
	var playerBox = $("<div>").attr("id","player_"+num).attr("class","player");
	var deleteButton = $("<button>").attr("id","delete_"+num).attr("onclick","removeCurrentPlayerFromList(this.parentNode);").append("X");
	var nameField = $("<input>").attr("type","text").attr("id","name_"+num).attr("placeholder","New Player").attr("size","20").attr("onchange","saveGame('name');").attr("tabindex",num);
	var levelField = $("<input>").attr("type","text").attr("id","level_"+num).attr("size","2").attr("onchange","changeLevel("+num+",'custom',this.value);").val(1);
	var plusButton = $("<button>").attr("id","plus_"+num).attr("onclick","changeLevel("+num+",'plus',null);").append("&nbsp;+&nbsp;");
	var minusButton = $("<button>").attr("id","minus_"+num).attr("onclick","changeLevel("+num+",'minus',null);").append("&nbsp;-&nbsp;");
	$(playerBox).append(deleteButton).append(nameField).append(levelField).append(plusButton).append(minusButton);
	return playerBox;
}

//Adds the player object to data and adds the player row to the page
function addPlayerToList(num) {
	if (data.playerCount < data.maxPlayers) {
		data.playerCount += 1;
		if (num == -1) {
			var playerBox = createPlayer(data.playerCount);
			$("#scorekeeper").append(playerBox);
			data.players.push({id: data.playerCount, name: "", level: 1});
		}
		else {
			var playerBox = createPlayer(num);
			$("#scorekeeper").append(playerBox);
		}
	}
}

//Used for deleting a specific player using the "delete" button
function removeCurrentPlayerFromList(playerBox) {
	if (confirm("Are you sure you want to delete this player?")) {
		if (data.playerCount > 2) {
			data.playerCount -= 1;			
			$(playerBox).remove();
		}
		else {
			var playerId = $(playerBox).attr("id");
			playerId = playerId.replace("player_","");
			$("#name_"+playerId).val("");
			$("#level_"+playerId).val("1");
		}
	}
	saveGame('remove current');
}

//Used for removing any additional players left when reducing data.maxPlayers
function removeExcessPlayers() {
	while (data.playerCount > data.maxPlayers) {
		$("#scorekeeper").children().last().remove();
		data.players.pop();
		data.playerCount -= 1;
	}
	saveGame('remove excess');
}

//Changes the level of a player
function changeLevel(id, operation, value) {
	if (data.players[id-1].name != "") {
		if (operation == "plus") {
			if (data.players[id-1].level < 10) {
				data.players[id-1].level += 1;
			}
		}
		else if (operation == "minus") {
			if (data.players[id-1].level > 1) {
				data.players[id-1].level -= 1;
			}
		}
		else if (operation == "custom") {
			if (value > 10) {
				alert("Levels can't exceed 10.");
			}
			else if (value < 1) {
				alert("Levels can't drop below 1.");
			}
			else {
				data.players[id-1].level = value;
			}
		}
		$("#level_"+id).val(data.players[id-1].level);
		saveGame('level');
	}
}

//Clears level data for a new game
function newGame() {
	console.log("New Game...");
	for (var i = 0; i < data.players.length; i++) {
		var id = data.players[i].id;
		data.players[i].level = 1;
		$("#level_"+id).val(1);
	}
	saveGame('new game');
}

//Saves data for the current game
function saveGame(message) {
	data.players = new Array();
	$(".player").each(function(index) {
		var playerId = $(this).attr("id");
		playerId = parseInt(playerId.replace("player_",""));
		var playerName = $("#name_"+playerId).val().trim();
		var playerLevel = parseInt($("#level_"+playerId).val());
		data.players.push({id: playerId, name: playerName, level: playerLevel});
	});
	clearStorage();
	console.log("Saving game... ("+message+")");
	localStorage.setItem("munchkinScorekeeper", JSON.stringify(data));
	console.log(JSON.stringify(data));
	console.log("Game Saved!");
}

//Adjusts max number of players 
function changeMaxPlayers(value) {
	data.maxPlayers = parseInt(value);
	if (data.maxPlayers < 2) {
		data.maxPlayers = 2;
	}
	else if (data.maxPlayers > 100) {
		data.maxPlayers = 100;
	}
	$("#max_players").val(data.maxPlayers);
	removeExcessPlayers();
}

//Resets the player form (clears all fields and erases data)
function resetGame() {
	clearStorage();
	$("#scorekeeper").html("");
	initData();
}

//Clears the localStorage data
function clearStorage() {
	console.log("Clearing Storage...");
	localStorage.removeItem("munchkinScorekeeper");
}

/*
//Adding event listeners for UI interactivity
$(document).ready(function(e) {
	//Button hovering (over, out)
	$("button, button.counter").hover(function(e) {
		$(this).css("background","#CCFFFF");
		$(this).css("cursor","pointer");
	}, function(e) {
		$(this).css("background","#CCCCCC");
		$(this).css("cursor","auto");
	});
});
*/