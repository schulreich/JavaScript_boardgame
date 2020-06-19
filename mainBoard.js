let MainBoard = function(){
    // let me allows access to object in loops and functions which override (this.)
    //let me = this;

    /* ******************
     * Board Properties
     ****************** */

    /**
     * defines how many lines the board has.
     */
    this.maxLine = 10;
    /**
     * defines how many column the board has.
     */
    this.maxColumn = 10;
    /**
     * defines how much percent of the board "cells" will have an obstacle.
     */
    this.obstaclePercent = 0.1;
    /**
     * defines which player is currently playing.
     * 0 is PlayerOne 1 is playerTwo.
     */
    this.currentPlayer = 1;
    /**
     * defines standart lifePoints from all players.
     */
    this.standardLifePoints = 100;
    /**
     * defines how many "cells" each player can move per turn.
     */
    this.movementRange = 3;

    this.pauseStatus = false;

    //this.boardWeaponListJsonPath = "boardWeaponList.json";

    /* **********
     * Constants
     ********** */
    this.grassType = "g";
    this.treeType = "t";
    this.stoneType = "s";
    this.rockType = "r";
    this.axeType =  "axe";
    this.swordType = "sword";
    this.bowType = "bow";
    this.wandType = "wand";
    this.knifeType = "knife";
    
    /**
     * this is a list of obstacles which will be placed randomly.
     */
    this.obstacleList = ["t","s","r"];
    /**
     * this is the list of weapons available.
     */
    this.weaponList = ["axe","sword","bow","wand","knife"];
    /**
     * this is the list of weapons that will be placed randomly on the board.
     */
    this.weaponListOnBoard = ["axe","sword","bow","wand"]
    /* **********
     * Mappings
     ********** */
    /**
     * mapping to the correct property, 0 is PlayerOne 1 is playerTwo.
     */
    this.playerMapping = ["playerOne","playerTwo"];

    /* **********
     * Board Data
     ********** */
    /**
     * board obstacles configuration (position of each obstacles).
     */
    this.map = [];
    /**
     * collection of all Objects placed on the board.
     */
    this.boardObjects = {
        treeList: [],
        rockList: [],
        stoneList: [],
        weaponList: [],
        playerOne: null,
        playerTwo: null
    };

    /* ********************
     * To be called outside
     ******************** */
    /**
     * generate the full board (grid, obstacles,weapons and players).
     */
    this.setup = function(){
        this.generateGrid();
        this.generateGrass();
        this.generateObstacles();
        this.draw();
        this.generateWeapons();
        this.generatePlayers();
    };
    /**
     * start the game will set the next player.
     */
    this.start = function(){
        this.setNextPlayer();
    };

    /* ******************
     * Setup Methods
     * Generate and Draw
     ****************** */
    /**
     * generateGrid create the mainboard "cells".
     * loop through each line and column.
     * for each line and column we create the divElement.
     * each div becomes:
     * - an ID
     * - multiple classes
     * - attribute lineNum and columnNum
     * - clickEvent
     */
    this.generateGrid = function(){
        let me = this;
        let mainBoardElement = document.getElementById("mainBoard");
        for(let line=0;line<this.maxLine;line++){
            for(let column=0;column<this.maxColumn;column++){
                let fieldID = "field_"+line+"_"+column;
                let classLine = "line_" + line;
                let classColumn = "column_" + column;
                let classLineType = "line_";
                if(line == 0 || line == 9){
                    classLineType += "block";
                }else{
                    classLineType += "grass";
                }
                let divElement = document.createElement("div");
                divElement.id = fieldID;
                divElement.className = fieldID +" "+ classLine +" "+ classColumn + " cell "+classLineType;
                divElement.setAttribute("lineNum",line);
                divElement.setAttribute("columnNum",column);
                divElement.addEventListener("click",function(){
                    me.clickBoardGridCellEvent(this);
                });
                // add divElement to the mainBoard
                mainBoardElement.appendChild(divElement);
            }
        }
    };
    /**
     * generateGrass prepare the map.
     * loop through every line and column.
     * it fills the map Array with the property grass.
     */
    this.generateGrass = function(){
        for(let loopLine = 0; loopLine < this.maxLine ; loopLine ++){
            this.map[loopLine] = [];
            for( let loopColumn = 0; loopColumn < this.maxColumn; loopColumn ++){
                this.map[loopLine][loopColumn] = this.grassType;
            }
        }
    };
    /**
     * generate Obstacles place Obstacles on the map.
     * Math.floor calculate amount of obstacles based percentage.
     * loop as many times defined and place one random obstacle on a random position in map.
     */
    this.generateObstacles = function(){
        let mapSize = this.maxLine * this.maxColumn;
        let maxObstacles = Math.floor(mapSize * this.obstaclePercent);

        for(let obstacleLoop = 0; obstacleLoop < maxObstacles; obstacleLoop ++){
            let obstacle = this.getRandomObstacle();
            this.placeObstacleElementRandom(obstacle);
        }
    };
    /**
     * TODO
     */
    this.generateWeapons = function(){
        let me = this;
        for(let weaponLoop = 0;weaponLoop < this.weaponList.length; weaponLoop ++){
            if(this.weaponListOnBoard.includes(this.weaponList[weaponLoop])){
                let position = this.getRandomWeaponPosition();
                switch(this.weaponList[weaponLoop]){
                    case this.axeType:
                        this.addWeaponElement(position.line,position.column,this.weaponList[weaponLoop],5);
                        break;
                    case this.swordType:
                        this.addWeaponElement(position.line,position.column,this.weaponList[weaponLoop],4);
                        break;
                    case this.bowType:
                        this.addWeaponElement(position.line,position.column,this.weaponList[weaponLoop],3);
                        break;
                    case this.wandType:
                        this.addWeaponElement(position.line,position.column,this.weaponList[weaponLoop],2);
                        break;
                    case this.knifeType:
                        this.addWeaponElement(position.line,position.column,this.weaponList[weaponLoop],1);
                        break;
                }
            }
        }

    };
    /**
     * generatePlayers generate the amount of players.
     * loop as many times as defined.
     * check with while loop valid Position using boundaryCheck and freespace.
     * also check that players are not next to each other.
     */
    this.generatePlayers = function(){
        for(let playerLoop = 0;playerLoop<2;playerLoop ++){
            let validPosition = false;
            while(validPosition == false){
                let line = this.getRandomLine();
                let column = this.getRandomColumn();
                if(
                    this.boundaryCheck(line,column) == true 
                    && this.freeSpace(line,column) == true
                    && this.playerNearPosition(line,column) == false
                    && this.playerAtPosition(line,column) == false
                    && this.weaponAtPosition(line,column) == false
                ){
                    validPosition = true;
                    //TODO addWeapon
                    this.addPlayerElement(line,column);
                }
            }
        }
    };
    /**
     * draw create Boardelements based on map configuration.
     * loop through each line and column of the map.
     * insert all obstacle elements.
     */
    this.draw = function(){
        for (let loopLine = 0;loopLine <this.maxLine; loopLine ++){
            for (let loopColumn = 0;loopColumn < this.maxColumn; loopColumn ++){
                let obstacle = this.map[loopLine][loopColumn];
                switch(obstacle){
                    case "t":
                        this.addTreeElement(loopLine,loopColumn);
                        break;
                    case "r":
                        this.addRockElement(loopLine,loopColumn);
                        break;
                    case "s":
                        this.addStoneElement(loopLine,loopColumn);
                        break;
                }
            }
        }
    };
    /**
     * get random obstacle return an random obstacle based on obstacle list.
     */
    this.getRandomObstacle = function(){
        let index = Math.floor(Math.random() * this.obstacleList.length);
        return this.obstacleList[index];
    };
    /**
     * placeObstacleElementRandom 
     * loop until a valid position for obstacle is found.
     */
    this.placeObstacleElementRandom = function(element){
        let validPosition = false;
        while(validPosition == false){
            let line = this.getRandomLine();
            let column = this.getRandomColumn();
            
            if(this.boundaryCheck(line,column) == true && this.freeSpace(line,column) == true){
                this.map[line][column] = element;
                validPosition = true;
            }
        }
    };

    this.getRandomWeaponPosition = function(){
        let position = {
            line : null,
            column : null
        };
        let validPosition = false;
        while(validPosition == false){
            let line = this.getRandomLine();
            let column = this.getRandomColumn();
            if(
                this.boundaryCheck(line,column) == true 
                && this.freeSpace(line,column) == true
                && this.weaponAtPosition(line,column) == false
            ){
                validPosition = true;
                position.line = line;
                position.column = column;
            }
        }
        return position;

    };

    /* **********
     * Player
     ********** */
    /**
     * getCurrentplayer returns the current player object, located in board objects.
     */
    this.getCurrentPlayer = function(){
        //0 = playerOne
        //1 = playerTwo
        if(this.currentPlayer != 1){
            this.currentPlayer = 0;
        }
        return this.boardObjects[this.playerMapping[this.currentPlayer]];
    }

    this.getNextPlayer = function(){
        let nextPlayer = null;
        if(this.currentPlayer != 1){
            nextPlayer = 1;
        }else{
            nextPlayer = 0;
        }
        return this.boardObjects[this.playerMapping[nextPlayer]];
    };
    /**
     * setNextPlayer switch between player 0 and 1.
     * show possible and impossible movement on the board.
     */
    this.setNextPlayer = function(){
        if(this.currentPlayer == 1){
            this.currentPlayer = 0;
        }else{
            this.currentPlayer = 1;
        }
        this.clearMovementCheck();
        this.showMovementPossible(this.getCurrentPlayer());
        this.showMovementImpossible(this.getCurrentPlayer());
    }
    this.setNextPlayerBattle = function(){
        if(this.currentPlayer == 1){
            this.currentPlayer = 0;
        }else{
            this.currentPlayer = 1;
        }
    }

    /* ********
     * Events
     ******** */
    /**
     * clickBoardGridCellEvent check if current clicked div is reachable by the current player.
     * if position is reachable move the player to new position and set the next player.
     */
    this.clickBoardGridCellEvent = function(divElement){
        if(!this.getPauseStatus()){
            let newLine = divElement.getAttribute("lineNum");
            let newColumn = divElement.getAttribute("columnNum");
            let previousLine = this.getCurrentPlayer().getCurrentLine();
            let previousColumn = this.getCurrentPlayer().getCurrentColumn();
            if(this.checkMovementPossible(this.getCurrentPlayer(), newLine, newColumn)){
                if(this.weaponAtPosition(newLine,newColumn)){
                    this.getCurrentPlayer().getWeapon().setCurrentLine(previousLine);
                    this.getCurrentPlayer().getWeapon().setCurrentColumn(previousColumn);
                    this.placeElement(previousLine,previousColumn,this.getCurrentPlayer().getWeapon().element);

                    let weaponIndex = this.getWeaponIndexAtPosition(newLine,newColumn);
                    this.boardObjects.weaponList[weaponIndex].setCurrentLine(-1);
                    this.boardObjects.weaponList[weaponIndex].setCurrentColumn(-1);
                    this.getCurrentPlayer().setWeapon(this.boardObjects.weaponList[weaponIndex]);
                    this.getCurrentPlayer().updateScoreBoardStats();
                }
                this.getCurrentPlayer().setCurrentPosition(newLine,newColumn);
                divElement.appendChild(this.getCurrentPlayer().element);
                if(this.playerNearPosition(this.getCurrentPlayer().getCurrentLine(),this.getCurrentPlayer().getCurrentColumn()) === true){
                    this.setPauseStatus(true);
                    this.clearMovementCheck();
                    this.startBattle();
                }else{
                    this.setNextPlayer();
                }
            }
        }
    }

    /* **********
     * Movement
     ********** */
    /**
     * clearMovementCheck remove all movement classes.
     */
    this.clearMovementCheck = function(){
        this.removeClassName("movement_possible");
        this.removeClassName("movement_impossible");
    };
    /**
     * showMovementPossible add movement_possible to each possible cells where the player can move.
     */
    this.showMovementPossible = function(player){
        let positions = this.getPossibleNewPositions(player);
        for(let positionLoop = 0; positionLoop < positions.length; positionLoop ++){
            this.getGridElement(positions[positionLoop].line, positions[positionLoop].column).classList.add("movement_possible");
        }
    };
    /**
    * showMovementImpossible add movement_impossible to each impossible cells where the player cant move.
    */
    this.showMovementImpossible = function(player){
        let positions = this.getImpossibleNewPositions(player);
        for(let positionLoop = 0; positionLoop < positions.length; positionLoop ++){
            this.getGridElement(positions[positionLoop].line, positions[positionLoop].column).classList.add("movement_impossible");
        }
    };

    /* **********
     * Conditions
     ********** */
    /**
     * boundaryCheck check if position is inside the board range (first and last lines are skipped).
     */
    this.boundaryCheck = function(line, column){
        if(line >= this.maxLine -1 || line < 1 || column >= this.maxColumn || column < 0){
            return false;
        }else{
            return true;
        }
    };
    /**
     * freespace check inside map if cell is grass type.
     */
    this.freeSpace = function(line,column){
        if(this.map[line][column] == this.grassType){
            return true;
        }else{
            return false;
        }
    };
    /**
     * playerAtPosition check if any player element is already inside cell. 
     */
    this.weaponAtPosition = function(line, column){
        for (let boardWeaponLoop = 0;boardWeaponLoop < this.boardObjects.weaponList.length; boardWeaponLoop ++){
            if(this.boardObjects.weaponList[boardWeaponLoop].isAtPosition(line,column)){
                return true;
            }
        }
        return false;
    };

    this.getWeaponAtPosition = function(line,column){
        for (let boardWeaponLoop = 0;boardWeaponLoop < this.boardObjects.weaponList.length; boardWeaponLoop ++){
            if(this.boardObjects.weaponList[boardWeaponLoop].isAtPosition(line,column)){
                return this.boardObjects.weaponList[boardWeaponLoop];
            }
        }
    };

    this.getWeaponIndexAtPosition = function(line,column){
        for (let boardWeaponLoop = 0;boardWeaponLoop < this.boardObjects.weaponList.length; boardWeaponLoop ++){
            if(this.boardObjects.weaponList[boardWeaponLoop].isAtPosition(line,column)){
                return boardWeaponLoop;
            }
        }
    };

    /**
     * playerAtPosition check if any player element is already inside cell. 
     */
    this.playerAtPosition = function(line, column){
        if(
            (
                this.boardObjects.playerOne !== null
                && this.boardObjects.playerOne.isAtPosition(line, column)
            )
            ||
            (  
                this.boardObjects.playerTwo !== null
                && this.boardObjects.playerTwo.isAtPosition(line, column)
            )
        ){
            return true;
        }else{
            return false;
        }
    };
    /**
     * playerNearposition check if one player is next to selected position.
     */
    this.playerNearPosition = function(currentLine,currentColumn){
        let directions = ["up","down","left","right"];
        for (let directionLoop = 0;directionLoop < directions.length;directionLoop ++){
            let line = currentLine;
            let column = currentColumn;
            switch(directions[directionLoop]){
                case "up":
                    line --;
                    break;
                case "down":
                    line ++;
                    break;
                case "left":
                    column --;
                    break;
                case "right":
                    column ++;
                    break;
            }
            if(
                this.boundaryCheck(line,column)
                &&
                this.playerAtPosition(line, column)
            ){
                return true;
            }            
        }
        return false;
    };
    /**
     * getPossibleNewPositions for selected player.
     * returns an array of possible positions.
     * for each directions check how far the player move based on movementRange.
     * break everytime an obstacle is found or out of boundary or player is found.
     */
    this.getPossibleNewPositions = function(player){
        let positions = [];
        let directions = ["up","down","left","right"];
        for (let directionLoop = 0;directionLoop < directions.length;directionLoop ++){
            let line = player.getCurrentLine();
            let column = player.getCurrentColumn();
            for(let loopRange = 0;loopRange < this.movementRange; loopRange ++){
                switch(directions[directionLoop]){
                    case "up":
                        line --;
                        break;
                    case "down":
                        line ++;
                        break;
                    case "left":
                        column --;
                        break;
                    case "right":
                        column ++;
                        break;
                }
                if(
                    this.boundaryCheck(line,column)
                    &&
                    this.freeSpace(line,column)
                    &&
                    !this.playerAtPosition(line, column)
                ){
                    positions.push({line: line,column: column});
                }else{
                    break;
                }
            }            
        }
        return positions;
    };
    /**
     * getImpossibleNewPositions for selected player.
     * returns an array of impossible positions.
     * for each directions check how far the player move based on movementRange.
     * break everytime an obstacle is found or out of boundary or player is found.
     */
    this.getImpossibleNewPositions = function(player){
        let positions = [];
        let directions = ["up","down","left","right"];
        for (let directionLoop = 0;directionLoop < directions.length;directionLoop ++){
            let line = player.getCurrentLine();
            let column = player.getCurrentColumn();
            for(let loopRange = 0;loopRange < this.movementRange; loopRange ++){
                switch(directions[directionLoop]){
                    case "up":
                        line --;
                        break;
                    case "down":
                        line ++;
                        break;
                    case "left":
                        column --;
                        break;
                    case "right":
                        column ++;
                        break;
                }
                if(
                    this.boundaryCheck(line,column)
                    &&
                    (
                        !this.freeSpace(line,column)
                        || 
                        this.playerAtPosition(line, column)
                    )
                ){
                    positions.push({line: line,column: column});
                    break;
                }
            }            
        }
        return positions;
    };
    /**
     * checkMovementPossible check if selected position for the selected player is possible.
     * get all possible positions and loop through them.
     * compare possible position with selected position. 
     */
    this.checkMovementPossible = function(player, line, column){
        if(
            !this.boundaryCheck(line,column)
            || !this.freeSpace(line,column)
        ){
            return false;            
        }

        let possiblePositions = this.getPossibleNewPositions(player);
        for(let possiblePositionLoop = 0; possiblePositionLoop < possiblePositions.length; possiblePositionLoop ++){
            if(
                possiblePositions[possiblePositionLoop].line == line
                && possiblePositions[possiblePositionLoop].column == column
            ){
                return true;
            }
        }
        return false;
    };

    /* **********
     * Helpers
     ********** */
    /**
     * getGridElement return div at selected position.
     */
    this.getGridElement = function(line,column){
        return document.getElementById("field_"+line+"_"+column);
    }
    /**
     * placeElement place boardElement to the div at selected position.
     */
    this.placeElement = function(line,column,element){
        this.getGridElement(line, column).appendChild(element);
    }
    /**
     * getRandomLine
     */
    this.getRandomLine = function(){
        return Math.floor(Math.random() * this.maxLine); 
    };
    /**
     * getRandomColumn
     */
    this.getRandomColumn = function(){
        return Math.floor(Math.random() * this.maxColumn); 
    };
    this.getRandomAttack = function(){
        return Math.floor(Math.random() * 10);
    };
    /**
     * removeClassname remove selected class name from the page.
     */
    this.removeClassName = function(className){
        //Array.prototype.slice.call converts an HTMLCollection into an Array.
        //HTMLCollection was updated automaticly after each classList remove call.
        //gridElements.length was always updated and Elements removed. 
        let gridElements = Array.prototype.slice.call(document.getElementsByClassName(className));
        for(let gridElementLoop = 0; gridElementLoop < gridElements.length; gridElementLoop ++){
            gridElements[gridElementLoop].classList.remove(className);
        }
    };

    /* ***************
     * Board Elements
     *************** */
    /**
     * addTreeElement create new boardObstacle object.
     * set type and create element and assign position.
     * place element on the board.
     * add object to boardObjects
     */
    this.addTreeElement = function(line,column){
        let obstacle = new BoardObstacle();
        obstacle.type = this.treeType;
        obstacle.element = document.createElement("div");
        obstacle.element.className = "tree";
        obstacle.setCurrentLine(line);
        obstacle.setCurrentColumn(column);
        this.placeElement(line,column,obstacle.element);
        this.boardObjects.treeList.push(obstacle);
    };
    /**
     * addStoneElement create new boardObstacle object.
     * set type and create element and assign position.
     * place element on the board.
     * add object to boardObjects
     */
    this.addStoneElement = function(line,column){
        let obstacle = new BoardObstacle();
        obstacle.type = this.stoneType;
        obstacle.element = document.createElement("div");
        obstacle.element.className = "stone";
        obstacle.setCurrentLine(line);
        obstacle.setCurrentColumn(column);
        this.placeElement(line,column,obstacle.element);
        this.boardObjects.treeList.push(obstacle);
    };
    /**
     * addRockElement create new boardObstacle object.
     * set type and create element and assign position.
     * place element on the board.
     * add object to boardObjects
     */
    this.addRockElement = function(line, column){
        let obstacle = new BoardObstacle();
        obstacle.type = this.rockType;
        obstacle.element = document.createElement("div");
        obstacle.element.className = "rock";
        obstacle.setCurrentLine(line);
        obstacle.setCurrentColumn(column);
        this.placeElement(line,column,obstacle.element);
        this.boardObjects.treeList.push(obstacle);
    };
    /**
     * addWeaponElement create new boardObstacle object.
     * set type and create element and assign position.
     * place element on the board.
     * add object to boardObjects
     */
    this.addWeaponElement = function(line, column, type, baseDamage){
        let weapon = new BoardWeapon();
        weapon.type = type;
        weapon.baseDamage = baseDamage;
        weapon.element = document.createElement("div");
        weapon.element.className = type;
        weapon.setCurrentLine(line);
        weapon.setCurrentColumn(column);
        this.placeElement(line,column,weapon.element);
        this.boardObjects.weaponList.push(weapon);
    };

    /**
     * addPlayerElement create new boardObstacle object.
     * set type and create element and assign position.
     * place element on the board.
     * add object to boardObjects
     */
    this.addPlayerElement = function(line,column){
        let scoreboardElement = document.getElementById("scoreBoard");
        let player = new BoardPlayer();
        player.lifePoints = this.standardLifePoints;
        player.element = document.createElement("div");
        player.setCurrentLine(line);
        player.setCurrentColumn(column);
        

        let weapon = new BoardWeapon();
        weapon.type = this.knifeType;
        weapon.baseDamage = 1;
        weapon.element = document.createElement("div");
        weapon.element.className = this.knifeType;
        weapon.setCurrentLine(-1);
        weapon.setCurrentColumn(-1);
        this.boardObjects.weaponList.push(weapon);
        player.setWeapon(weapon);

        if(this.boardObjects.playerOne === null){
            player.element.className ="player playerOne playerOneDown";
            this.placeElement(line,column,player.element);
            this.boardObjects.playerOne = player;
            this.boardObjects.playerOne.createScoreBoard("playerOneScoreBoard");
            this.boardObjects.playerOne.scoreBoard.setPlayer("playerOne playerOneDown");
            scoreboardElement.appendChild(this.boardObjects.playerOne.getScoreBoardElement());
        }else{
            player.element.className ="player playerTwo playerTwoDown";
            this.placeElement(line,column,player.element);
            this.boardObjects.playerTwo = player;
            this.boardObjects.playerTwo.createScoreBoard("playerTwoScoreBoard");
            this.boardObjects.playerTwo.scoreBoard.setPlayer("playerTwo playerTwoDown");
            scoreboardElement.appendChild(this.boardObjects.playerTwo.getScoreBoardElement());
        }
    };

    this.setPauseStatus = function(pauseStatus){
        if(pauseStatus === true || pauseStatus === false){
            this.pauseStatus = pauseStatus;
        }
    };

    this.getPauseStatus = function(){
        return this.pauseStatus;
    };
/**
 * 
 * Battle Phase
 */


 /**
  * MainBoard fadeOut 
  * playerBtn events for each player
  * BattleBoard fadeIn
  */
    this.startBattle = function(){
        $("#mainBoard").fadeOut();
        let me = this;
        document.getElementById("playerOneAttackBtn").addEventListener("click",function(){
            me.currentPlayerAction(0,"attack");
        });
        document.getElementById("playerOneDefenseBtn").addEventListener("click",function(){
            me.currentPlayerAction(0,"defense");
        });
        document.getElementById("playerTwoAttackBtn").addEventListener("click",function(){
            me.currentPlayerAction(1,"attack");
        });
        document.getElementById("playerTwoDefenseBtn").addEventListener("click",function(){
            me.currentPlayerAction(1,"defense");
        });
        $(".playerWinner").addClass("invisible");
        $("#battleBoard").fadeIn();
        this.currentPlayerEnable();
    };

    this.currentPlayerAction = function(ownerBtn, playerAction){
        /**
         * test if ownerButton is this current player
         * if yes call attack or defense based on playerAction
         * if no, this means button is disabled, dont do anything
         */
        if(this.currentPlayer == ownerBtn){
            switch(playerAction){
                case "attack":
                    this.currentPlayerAttack();
                    break;
                case "defense":
                    this.currentPlayerDefense();
                    break;
            }
        }
    };

    this.currentPlayerAttack = function(){
        /**
         * currentPlayer turn off defense mode
         * calculate damange from current player
         * reduce next player lifePoints
         * check lifepoints
         * if still alive
         * - set next player
         * - currentPlayerEnable
         * else
         * - show battle end
         */
        this.getCurrentPlayer().setDefenseMode(false);
        let damage = this.getCurrentPlayer().getDamage();
        //miss/normal/critical
        let randomAttack = this.getRandomAttack();
        if(randomAttack < 3){
            damage = 0;
        }else if(randomAttack >= 8){
            damage = damage*2;
        }
        let receivedDamage = this.getNextPlayer().receiveDamage(damage);
        let displayMessage = "";
        if(randomAttack < 3){
            displayMessage += "Missed!"; 
        }else if(randomAttack >= 8){
            displayMessage += "Critical Hit!";
        }else{
            displayMessage += "Attack!";
        }
        displayMessage += " ("+receivedDamage+")";
        if(this.currentPlayer === 0){
            $("#playerTwoLog").html(displayMessage).fadeIn();
            $("#healthBarPlayerTwo").val(this.getNextPlayer().getLifePoints());
            $('#playerTwoLog').fadeOut(1000);
        }else{
            $("#playerOneLog").html(displayMessage).fadeIn();
            $("#healthBarPlayerOne").val(this.getNextPlayer().getLifePoints());
            $("#playerOneLog").fadeOut(1000);
        }
        

        if(this.getNextPlayer().checkStillAlive()){
            this.setNextPlayerBattle();
            this.currentPlayerEnable();
        }else{
            $("#playerOneBtn").addClass("invisible");
            $('#playerTwoBtn').addClass("invisible");
            if(this.currentPlayer === 0){
                $("#playerOneWinner").removeClass("invisible").fadeIn();
            }else{
                $("#playerTwoWinner").removeClass("invisible").fadeIn();
            }
            $("#newGameBtn").removeClass("invisible").fadeIn();
        }
    };
    this.currentPlayerDefense = function(){
        /**
         * currentPlayer turn on defense mode
         * set next player
         * currentPlayerEnable
         */

        let displayDefenseMode = "Defend!";
        this.getCurrentPlayer().setDefenseMode(true);

        if(this.currentPlayer === 0){
            $("#playerOneLog").html(displayDefenseMode).fadeIn();
            $("#playerOneLog").fadeOut(1000);
        }else{
            $("#playerTwoLog").html(displayDefenseMode).fadeIn();
            $("#playerTwoLog").fadeOut(1000);
        }
        
        this.setNextPlayerBattle();
        this.currentPlayerEnable();
    };
    this.currentPlayerEnable = function(){
        /**
         * switch on currentPlayer
         * which button should be enabled
         */
        $('#playerOneBtn, #playerTwoBtn').children().removeClass("battleBtnDisable");
        switch(this.currentPlayer){
            case 0:
                $("#playerTwoBtn").children().addClass("battleBtnDisable");
                break;
            case 1:
                $("#playerOneBtn").children().addClass("battleBtnDisable");
                break;
        }
    }
};
