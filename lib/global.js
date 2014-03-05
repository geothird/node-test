var global = function global(){
    var title = '';
    this.getTitle = function(){
        return title;
    };
    this.setTitle = function(val){
     title = val;
    };
    if(global.caller != global.getInstance){
        throw new Error("This object cannot be instantiated.");
    }
}

global.instance = null;

/**
 * global getInstance definition
 * @return singleton class
 */
global.getInstance = function(){
    if(this.instance === null){
        this.instance = new global();
    }
    return this.instance;
}

exports.global = global.getInstance();
