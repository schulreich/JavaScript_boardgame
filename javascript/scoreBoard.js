
let scoreBoard = function(){
    this.mainElement = null;
    this.playerElement = null;
    this.lifeElement = null;
    this.atkElement = null;
    this.defElement = null;
    this.weaponElement = null;

    /**
     * create playerElement and add class playerLabel
     */
    this.createPlayerElement = function(){
        this.playerElement = document.createElement("div");
        this.playerElement.className ="playerLabel";
    };
    /**
     * create lifeElement and classes lifePoints and scoreBoardLine
     */
    this.createLifeElement = function(){
        this.lifeElement = document.createElement("div");
        this.lifeElement.className = "lifePoints scoreBoardLine";
    };
    
    /**
     * create atkElement and classes atkPoints,scoreBoardLine
     */
    this.createAtkElement = function(){
        this.atkElement = document.createElement("div");
        this.atkElement.className = "atkPoints scoreBoardLine";
    }
    /**
     * create defElement and classes defPointsm scoreBoardLine
     */
    this.createDefElement = function(){
        this.defElement = document.createElement("div");
        this.defElement.className = "defPoints scoreBoardLine";
    }

    /**
     * create weaponElement and classe currentWeapon
     */
    this.createWeaponElement = function(){
        this.weaponElement = document.createElement("div");
        this.weaponElement.className = "currentWeapon";
    }

    /**
     * create scoreBoardElement and class scoreBoard
     * called methods and append them to scoreBoard element
     */
    this.createScoreBoard = function(divId){
        this.mainElement = document.createElement("div");
        this.mainElement.className = "scoreBoard";
        this.mainElement.id = divId;

        this.createPlayerElement();
        this.createLifeElement();
        this.createAtkElement();
        this.createDefElement();
        this.createWeaponElement();
        
        this.mainElement.appendChild(this.playerElement);
        this.mainElement.appendChild(this.lifeElement);
        this.mainElement.appendChild(this.atkElement);
        this.mainElement.appendChild(this.defElement);
        this.mainElement.appendChild(this.weaponElement);
    };

    /**
     * methods to display scoreBoardElements added classes for values and imgages 
     */

    this.setPlayer = function(player){
        this.playerElement.innerHTML = "<div class='"+player+" scoreBoardPlayer'></div> ";
    }

    this.setLifePoints = function(lifePoints){
        this.lifeElement.innerHTML = "<div class='lifeIcon scoreBoardLabels'></div><div class='scoreBoardValues'>"+lifePoints+"</div>";
    };
    this.setAttack = function(damage){
        this.atkElement.innerHTML = "<div class='attackIcon scoreBoardLabels'></div><div class='scoreBoardValues'>"+damage+"</div>";
    };
    this.setDefense = function(defense){
        this.defElement.innerHTML =  "<div class='defenseIcon scoreBoardLabels'></div><div class='scoreBoardValues'>"+defense+"</div>";
    };

    this.setWeapon = function(weapon){
        this.weaponElement.appendChild(weapon.element);
    };
};
