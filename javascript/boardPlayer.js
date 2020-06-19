let BoardPlayer = function(){
    this.element = null;
    this.scoreBoard = null;
    
    this.lifePoints = 100;
    this.baseDamage = 9;
    this.defense = 8;
    this.weapon = null;
    this.defenseMode = false;


    /**
     * 
     * 
     */
    this.getCurrentLine = function(){
        return parseInt(this.element.getAttribute("lineNum"));
    };

    this.getCurrentColumn = function(){
        return parseInt(this.element.getAttribute("columnNum"));
    };

    this.setCurrentLine = function(line){
        this.element.setAttribute("lineNum", line);
    };

    this.setCurrentColumn = function(column){
        this.element.setAttribute("columnNum", column);
    };

    this.setCurrentPosition = function(line,column){
        this.setCurrentLine(line);
        this.setCurrentColumn(column);
    };

    this.isAtPosition = function(line, column){
        if(
            this.getCurrentLine() == line
            && this.getCurrentColumn() == column
        ){
            return true;
        }else{
            return false;
        }
    };

    this.getLifePoints = function(){
        return this.lifePoints;
    };

    this.getBaseDamage = function(){
        return this.baseDamage;
    };

    this.getDamage = function(){
      return this.baseDamage + this.weapon.baseDamage;  
    };

    this.receiveDamage = function(damage){
        if(this.getDefenseMode() === true){
            damage = damage - this.defense;
            if(damage < 0){
                damage = 0;
            }    
        }
        if(damage > 0){
            this.lifePoints = this.lifePoints - damage;
            if(this.lifePoints < 0 ){
                this.lifePoints = 0;
            }
            this.updateScoreBoardStats();
        }
        return damage;
    };

    this.getWeapon = function(){
        return this.weapon;
    };

    this.getDefense = function(){
        return this.defense;
    };

    this.setLifePoints = function(lifePoints){
        this.lifePoints = lifePoints;
    };

    this.setBaseDamage = function(baseDamage){
        this.baseDamage = baseDamage;
    };

    this.setDefense = function(defense){
        this.defense = defense;
    };

    this.setWeapon = function(weapon){
        this.weapon = weapon;
    };

    this.createScoreBoard = function(div_id){
        this.scoreBoard = new scoreBoard();
        this.scoreBoard.createScoreBoard(div_id);
        this.updateScoreBoardStats();
    };

    this.getScoreBoardElement = function(){
        return this.scoreBoard.mainElement;
    };

    this.updateScoreBoardStats = function(){
        this.scoreBoard.setLifePoints(this.lifePoints);
        this.scoreBoard.setAttack(this.getDamage());
        this.scoreBoard.setDefense(this.defense);
        this.scoreBoard.setWeapon(this.weapon);
    };

    this.getDefenseMode = function(){
        return this.defenseMode;
    };
    
    this.setDefenseMode = function(enabled){
        if(enabled === true){
            this.defenseMode = true;
            console.log("defense enabled");
        }else{
            this.defenseMode = false;
            console.log("defense disabled");
        }
    };

    this.checkStillAlive = function(){
        if(this.lifePoints > 0){
            return true;
        }else{
            return false;
        }
    };
};

