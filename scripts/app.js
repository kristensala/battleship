var boardSize;
var validShipsNum;
var playerShips;
var opponentShips
var state;
var shipsOnBoard
var playerTurn; // 1- player turn 0-not player turn
var computerTurn;// 1- PC turn 0-not PC turn
var playerMoves;
var computerMoves;
var who;
var result = [];

function play(){
    $("#playerBoard").empty(); 
    $("#computerBoard").empty();
    
    state = 0;
    boardSize = parseInt($("#boardSizeSelect").val());
    validShipsNum = parseInt($("#numberOfShipsSelect").val());
    shipsOnBoard = 0;
    opponentShips = 0;
    playerMoves = 0;
    computerMoves = 0;
    playerTurn = 1;
    
    
    if (isNaN(validShipsNum) || isNaN(boardSize)){
        alert("You need to choose both fields");
    }else if(validShipsNum > boardSize - 1){
        alert("Too many ships");
    }else{
        createBoard("playerBoard", boardSize);
        createBoard("computerBoard", boardSize);
    } 
}
function createBoard(board, size) {
    var battleBoard = $("#"+board);
    var table  = $("<table></table>");
    
    for (var i = 0; i < size; i++) {
        var tableRow = $("<tr></tr>");
        for (var j = 0; j < size; j++){
            var tableCell = $("<td></td>");
            tableCell.data("y",i);
            tableCell.data("x",j);
            if (board == "playerBoard"){
                tableCell.addClass("playerCell");
            } else if (board == "computerBoard") {
                tableCell.addClass("computerCell");
            }
            
            tableRow.append(tableCell);
            tableCell.click(placeShips); 
        }
        table.append(tableRow);
    }
    battleBoard.append(table);
}
function validShipPlacement(x,y,field) {
    var board;
    var boatClass;
    
    if (field == 0) { // 0 = player board
        board = "#playerBoard";
        boatClass = "boat";
        
    }else if (field == 1) { // 1 = computer board
        board = "#computerBoard";
        boatClass = "opponentBoat";
    }
    var clickedCell = $($($(board).find("tr")[y]).find("td")[x]);

    var rightCell = $($($(board).find("tr")[y]).find("td")[x+1]);
    var leftCell = $($($(board).find("tr")[y]).find("td")[x-1]);
    var bottomCell = $($($(board).find("tr")[y+1]).find("td")[x]);
    var topCell = $($($(board).find("tr")[y-1]).find("td")[x]);
    var secondRight = $($($(board).find("tr")[y]).find("td")[x+2]);
    var diagonal1 = $($($(board).find("tr")[y-1]).find("td")[x+1]);
    var diagonal2 = $($($(board).find("tr")[y+1]).find("td")[x+1]);
    
    if (rightCell.hasClass(boatClass) ||
       leftCell.hasClass(boatClass)||
       bottomCell.hasClass(boatClass)||
       topCell.hasClass(boatClass)||
       secondRight.hasClass(boatClass)||
       diagonal1.hasClass(boatClass)||
       diagonal2.hasClass(boatClass)||
       x == boardSize - 1) {
        return false;
    } else {
        return true;
    }     
}
function placeShips() {
    var x = $(this).data("x");
    var y = $(this).data("y");

    if (state == 0) {
        var rightCell = $($($("#playerBoard").find("tr")[y]).find("td")[x+1]);
        
        if(validShipPlacement(x, y, 0) == true && $(this).hasClass("playerCell")) {
            $(this).addClass("boat");
            $(rightCell).addClass("boat");
            shipsOnBoard++;
            
            if(shipsOnBoard == validShipsNum) {
                generateOpponentShips();
                state = 1;
                alert("Start Bombing!");
            }
        }
    } else if (state == 1) {
        if($(this).hasClass("computerCell")) {
            playerBombing(x,y);  
        
        }
    }
}
function generateOpponentShips() {
    var counter = 0; 
    validShipsNum = parseInt($("#numberOfShipsSelect").val());
    while(opponentShips < validShipsNum) {
        var x = Math.floor((Math.random() * boardSize));
        var y = Math.floor((Math.random() * boardSize));
        
        var defaultCell = $($($("#computerBoard").find("tr")[y]).find("td")[x]);
        var rightCell = $($($("#computerBoard").find("tr")[y]).find("td")[x+1]);

        if (validShipPlacement(x,y,1) == true) {
            $(defaultCell).addClass("opponentBoat").addClass("hiddenOpponentBoat");
            $(rightCell).addClass("opponentBoat").addClass("hiddenOpponentBoat");
            opponentShips++;
            counter=0; 
        } else if (counter >= 500) {
            $("#computerBoard").find(".computerCell.opponentBoat").removeClass("opponentBoat");
            opponentShips = 0;
        } else {
            counter++;
        }
    }
}
function playerBombing(x,y) {
    if(playerTurn == 1) {
        var clickedCell = $($($("#computerBoard").find("tr")[y]).find("td")[x]);
        
        if(clickedCell.hasClass("computerCell") && clickedCell.hasClass("hiddenOpponentBoat")) {
            clickedCell.removeClass("hiddenOpponentBoat");
            clickedCell.addClass("boatHit");
            playerMoves++;
            winner();
        } else if((clickedCell.hasClass("computerCell") && clickedCell.hasClass("boatHit")) || (clickedCell.hasClass("computerCell") && clickedCell.hasClass("missedShot"))) {
            playerTurn = 1;
        } else if(clickedCell.hasClass("computerCell") && !clickedCell.hasClass("hiddenOpponentBoat")) {
            clickedCell.addClass("missedShot");
            playerTurn = 0;
            playerMoves++;
        }
    }
    if(playerTurn == 0) {
        computerTurn();
        playerTurn = 1;
    }
}
function computerTurn() {
    
    var x = Math.floor((Math.random() * boardSize));
    var y = Math.floor((Math.random() * boardSize));
    var clickedCell = $($($("#playerBoard").find("tr")[y]).find("td")[x]);
    
    if(clickedCell.hasClass("playerCell") && clickedCell.hasClass("boat")) {
        clickedCell.removeClass("boat");
        clickedCell.addClass("boatHit");
        computerMoves++;
        winner();
        computerTurn();
    } else if((clickedCell.hasClass("playerCell") && clickedCell.hasClass("boatHit")) || (clickedCell.hasClass("playerCell") && clickedCell.hasClass("missedShot"))) {
        computerTurn();
    } else if(clickedCell.hasClass("playerCell") && !clickedCell.hasClass("boat")) {
        clickedCell.addClass("missedShot");
        computerMoves++;
    } 
}
function winner(){
    var playerShipsLeftOnBoard = $("#playerBoard").find(".playerCell.boat").length;
    var computerShipsLeftOnBoard = $("#computerBoard").find(".computerCell.hiddenOpponentBoat").length;
    
    if (playerShipsLeftOnBoard == 0){
        whoWon("Computer Won!");
    } else if (computerShipsLeftOnBoard == 0) {
        whoWon("You Won!");
    }
}
function whoWon(who){
    state = 2;
    saveResults();
    showLastResults();
    alert(who + " Player Moves " + playerMoves + "; Computer Moves: " + computerMoves);
}
function saveResults(){
    if (result.length >= 10) {
        result.pop();
    }
    var stats =[];
    stats[0] = boardSize + "x" + boardSize;
    stats[1] = validShipsNum;
    stats[2] = playerMoves;
    stats[3] = computerMoves;
    result.unshift(stats);
}
function showLastResults () {
    var table = "<table><tr><th>Size</th><th>Ships on board</th><th>My Moves</th><th>Computer Moves</th></tr>";
    for (var i = 0; i<result.length; i++){
        table += "<tr>";
        for (var j = 0; j<result[i].length; j++) {
            table += "<td>" + result[i][j] + "</td>"
        }
        table += "</tr>"
    }
    table += "</table>";
    $(".results").html(table);
    
}











