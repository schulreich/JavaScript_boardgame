let BoardWeapon = function(){
    this.element = null;
    this.type = null;
    this.class = null;
    this.baseDamage = null;
    
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

    
};