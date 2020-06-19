let BoardObstacle = function(){
    this.element = null;
    this.type = null;

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
};