/**
 * Created by DerekJLin on 10/7/16.
 */

//CREATE A WORLD OBJECT
var plan = ["############################",
    "#      #    #      o      ##",
    "#                          #",
    "#          #####           #",
    "##         #   #    ##     #",
    "###           ##     #     #",
    "#           ###      #     #",
    "#   ####                   #",
    "#   ##       o             #",
    "# o  #         o       ### #",
    "#    #                     #",
    "############################"];


//VECTOR
//represents a location in the grid
function Vector(x,y){
    this.x = x;
    this.y = y;
}

//adds two vectors and returns new vector location
Vector.prototype.plus = function(other){
    return new Vector(this.x + other.x, this.y + other.y);
}



//GRID
//represents the World in a 1D- array.
//keeps track of content
function Grid(width, height){
    this.width = width;
    this.height = height;
    this.space = new Array(width * height);
}

//get content of a location in the World using a 2D standpoint, vs. the 1-D array format.
//algorithm used allows a 2d way to access a 1d array's contents.
Grid.prototype.get= function(vector){
    return this.space[vector.x + (this.width * vector.y)];

}

Grid.prototype.set = function(vector, value){
    this.space[vector.x + (this.width * vector.y)] = value;
}

//override Object.prototype's forEach so that it only checks filled locations
//to make sure that the normal function can simply take in

//page 126 - WHY WILL IT NOT BE A HIGHER ORDER FUNCTION? IT STILL CALLS A FUNCTION!!!
Grid.prototype.forEach = function(f,context){

    //go through each location in the World
    for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){

            var value = this.get(new Vector(x,y))

            //execute function only if there is a critter
            if (value !== null){
                f.call(context,value,new Vector(x,y))///WHAT IS GOING ON HERE?????
            }

        }
    }
}
////////


//////STARTING VALUES//////


var directions = {
    "n":  new Vector( 0, -1),
    "ne": new Vector( 1, -1),
    "e":  new Vector( 1,  0),
    "se": new Vector( 1,  1),
    "s":  new Vector( 0,  1),
    "sw": new Vector(-1,  1),
    "w":  new Vector(-1,  0),
    "nw": new Vector(-1, -1)
};

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

/////////////////////





//////////WORLD//////////


//World primarily controls the actiosn of the content, and thus does not initialize a grid.
//World has:
    // map (array of row arrays)--> grid - the content and dimensions of the world
    // legend(obj) - tells you what's what on the map
function World(map, legend){

    this.legend = legend;
    // a 1D array that keeps track of content given the dimensions
    var grid = new Grid(map[0].length, map.length); //ALLOWS closure to access grid.
    //transfer the map onto a grid using a legend.
    map.forEach(function(line,y){//element, index of element(row)
        //iterate right
        for (var x = 0; x < line.length; x++){
            grid.set(new Vector(x,y),
                elementFromChar(line[x]));
        }
    });

    this.grid = grid;
}

//legend - is an object that (ch : objectName)
function elementFromChar(legend,ch){
    if(ch == "")
        return null

    var element = new legend[ch](); // CONSTRUCT AN OBJECT FROM THE VALUE OF THE CHAR IN LEGEND.

    element.originChar = ch;
    return element;
}

// null --> empty location
function charFromElement(element){
    if(element == null)
        return ""
    else
        return element.originChar;
}

//gives each critter a turn to act and triggers an action if
// action is valid or the createure has not acted yet
World.prototype.turn = function() {

    var acted = [];

    //value -->  critter, view --> vector
    this.grid.forEach(function (critter, vector) {

            //check if critter already acted or can act
            if (critter.act && acted.indexOf(critter) == -1)
                acted.push(critter);

            //execute the action
            this.letAct(critter,vector);
        }
        //CONTEXT BINDING
        // - enables the closure callback to access the invoking instance's properties (the outer this proprety)
        // by binding the closure's context to the this of the higher-order forEach .
        ,this);
};

//triggers the critter to perform the action, but not the full execution.

//WHY IS IT THAT AS THE ACTION TYPES INCREASED, HANDLE ALL ACTIONS THROUGH AN INTERFAE OBJECT???????

World.prototype.letAct = function(critter, vector){

    //extract information about action based on the critter's view
    var action = critter.act(new View(this,vector));

    //IF ACTION IS MOVE
    if (action && action.type == move)

    //obtain info on destination
        var dest = this.checkDestination(action,vector);

    //check if direction of action is valid and dest is on board
    //check if destination is empty
    if(dest && this.grid.get(dest) == null)
            this.grid.set(vector,null);
            this.grid.set(dest, critter);
};

    //check if direction of action is valid and dest is on board
World.prototype.checkDestination = function(action,vector) {
    //if direction of action is valid
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(action.direction)

        //if dest is inside grid of world
        if (this.grid.isInside(dest)) {
            return dest;
        }
    }
    ;
};





    //View

    // a critter's view of the world from its location(vector)
    function View(world, vector){
        this.world = world;
        this.vector = vector;
    }

    //returns what a critter sees(character form) from looking in one direction
    //from its view
    View.prototype.look = function(dir){

        //where the critters is looking
        var target = this.vector.plus(directions[dir])

        // if target is on grid
        if (this.world.grid.isInside(target))
            return charFromElement(this.world.grid.get(target));

        else
            return "#";


    };


    //find all direction that yield a specific character
    // based on the view of the critter
    View.prototype.findAll = function(ch) {

        var found = [];

        for (var dir in directions) {

            if (this.look(dir) == ch)
                found.push(dir)
        }
        return found;
    }

//QUESTION::::::why make the critter's actions have a view instead of
// making the critter a class and then making it its actions and properties?
// Does it have anythign to do with the fact that js is programmed differnetly?
    View.prototype.find = function(ch){

        //generate an array of directions
        var found = this.findAll(ch);

        //if there is no valid direction
        if(found.length == 0)
                return null;

        return randomElement(found);

    };


//chnage the direction in which you go for the wallflower plant
//WHAT IS IT DOING : it's iterating through the directions object's properties to turn 45 deg for each n.
function dirPlus(dir,n){

    //get starting index of direction
    var index = directionsNames.indexOf(dir);

    //iterating through the property values of the directionsNames array, means turign 45 deg for each n.

    //LOOK OVER THE LOGIC OF THIS CODE

    //what's the math behidn this?????
    return directionsNames[(n + index + 8) % 8 ];
}


///////////
//CRITTERS//////////////////////////
////////////

//Bouncing Critter
function BouncingCritter() {
    this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ")
        this.direction = view.find(" ") || "s";
    return {type: "move", direction: this.direction};
};

//WALLFOLLOWER
function WallFollower(){

    //what is this?????
    this.dir = "s";
}


///IMOPRTANT: YEAH CAN YOU PLEASE EXPLAIN TO ME THIS IMLEMENATOIN?
//DETERMIENES HOW THE WALLFOLLOWER WILL ACT BASED ON IT PROPERTIES
//RETURNS--> DATA ABOUT ACTION
WallFollower.prototype.act = function(view){
    var start = this.dir;

    //what does this line mean??????//why is his neccesarry has something
    //to do with walking in circles
    if(view.look(dirPlus(this.dir,-3)) != " ")
        start = this.dir = dirPlus(this.dir,-2)

    //start looking for stuff until you see an empty spot or
    // get to initial search position
    while(view.look(this.dir) != " "){

        this.dir = dirPlus(this.dir,1);

        //if return to initial position, stp search
        if(this.dir == start) break;
    }

    //return actoin information based on directoin
    return {type:"move", direction:this.dir};
}
///////////


//PLANT

function Plant(){
    this.energy = 3 + Math.random() * 4
}


//determine how the plant will act
Plant.prototype.act = function(context) {
    if (this.energy > 15) {

        //find directoin that has empty space
        var space = context.find(" ");
        if (space)
            return {type: "reproduce", direction: space};
    }
    if (this.energy < 20)
        return {type: "grow"};
};

//////////


//PLANT EATER/////
function PlantEater(){
    this.energy = 20;
}


PlantEater.prototype.act = function(context){
    var space = context.find(" ");
    if(this.energy > 60 && space){
        return {type: "reproduce", direction: space};
    }
    var plant = context.find("*");
    if (plant)
        return {type: "eat", direction: plant};
    if(space)
        return {type: "move", direction: space};
}
//////////




//LIFELIKEWORLD//

function LifelikeWorld(map,legend){
    World.call(this,map,legend);
}

//what exactly is happening here?
//AM I CREATING A PROTOTYPE FOR LIFELIKEWORLD'S PROTOTYPE?
LifelikeWorld.prototype = Object.create(World.prototype);


//HIGHER LEVEL FUNCTION THAT PROVIDES RAW VALUES, BUT NO IMPLEMENTTAION(LOGIC) OF THE ACTION.
//WHATIS THE ADVANTAGE OF SUCH A DESIGN PARADIGM?  of using such an interface????
//ALLOWS THE CRITTER TO ACT
//DETERMINES WHETHER OR NOT A CRITTER ACTS AND WHAT IT ACTUALLY DOES
LifelikeWorld.prototype.letAct = function(critter, vector){

    //IMPORTNAT: obtain information about actoin based on CRITTER'S VIEW OF the world
    var action = critter.act(new View(this, vector));

    //validate action and have the world TRIGGER THE CRITTER


    //important:  YOU ARE ACTUALLY EXECUTING THE FUNCTION IN THE ASSIGNMENT
    //PRINCIPLE:
        //BY USING AN OBJECT THAT STORES EXECUTION-CONTEXT CALLBACK FUNCTIONS.E
    // IN ONE LINE, YOU CAN CHECK THE CONDITIONS OF THE CALLBACK AND EXECUTE IT IF THER CONDITIONS ARE CORRECT
    var handled = action && action.type in actionTypes && actionTypes[action.type].call(this, critter, vector, action);

    //if action fails, energy is wasted
    //DOES THIS PART EXECUTE THE ACTION????

    if(!handled) {
        critter.energy -= 0.2

        //critter dies
        if(critter.energy <= 0)
            this.grid.set(vector, null);

    }
}



//ACTION TYPES:

    //AN INTERFACE FOR EXECUTIN ACTIONS ON CRITTERS
    //provides implemenation and indicates success of action

//no Object prototype namespace conflicts
var actionTypes = Object.create(null);


actionTypes.grow = function(critter) {
    critter.energy += 0.5;
    return true;
}

actionTypes.move = function(critter, vector, action){
    var dest = this.checkDestination(action,vector)

    if(dest == null || critter.energy<=1 || this.grid.get(dest) != null)
        return false;
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest,critter);
    return true;
}



///HELPPPPPPPPPPPP????? LLLLLOOOOOK OVER SHEET!!!!!!!!!!
actionTypes.eat = function(critter, vector, action){

    //check where the prey is
    var dest = this.checkDestination(action,vector)

    //return info about the prey and destination is valid
    //WHAT EXACTLY ARE WE CHECKING HERE????
    var atdest = (dest != null) && (this.grid.get(dest))


    //WHY CHECK FOR NULL? instead of just 0?????
    if (atdest != null || atdest.energy == null) {
        critter.energy += atdest.energy;
        this.grid.set(dest,null);
        return true;
    }
    return false;
}


actionTypes.reproduce = function(critter,vector,action) {
    var baby = elementFromChar(this.legend, critter.originChar);
    var dest = this.checkDestination(action, vector);

    //if destination off grid
    //critter not enough energy
    //birthplace is occupied
    if (dest == null || critter.energy <= 2 * baby.energy || this.grid.get(dest) != null)
        return false;
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
}


//SIMULATION OF THE WORLD

var valley = new LifelikeWorld(
    ["############################",
        "#####                 ######",
        "##   ***                **##",
        "#   *##**         **  O  *##",
        "#    ***     O    ##**    *#",
        "#       O         ##***    #",
        "#                 ##**     #",
        "#   O       #*             #",
        "#*          #**       O    #",
        "#***        ##**    O    **#",
        "##****     ###***       *###",
        "############################"],
    {"#": Wall,
        "O": PlantEater,
        "*": Plant}
);


LOGIC PRINCIPLES:

WRITE THERM HERE.


1.







/////////////////////////         ///    V  /////////////////////////         ///
        /////REAL VERSION////                           /////REAL ONE////


        /////////////////////////         ///
///////////REAL ONE////



var plan = ["############################",
    "#      #    #      o      ##",
    "#                          #",
    "#          #####           #",
    "##         #   #    ##     #",
    "###           ##     #     #",
    "#           ###      #     #",
    "#   ####                   #",
    "#   ##       o             #",
    "# o  #         o       ### #",
    "#    #                     #",
    "############################"];

function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
}
Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
        vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
};

var directions = {
    "n":  new Vector( 0, -1),
    "ne": new Vector( 1, -1),
    "e":  new Vector( 1,  0),
    "se": new Vector( 1,  1),
    "s":  new Vector( 0,  1),
    "sw": new Vector(-1,  1),
    "w":  new Vector(-1,  0),
    "nw": new Vector(-1, -1)
};

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
    this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ")
        this.direction = view.find(" ") || "s";
    return {type: "move", direction: this.direction};
};

function elementFromChar(legend, ch) {
    if (ch == " ")
        return null;
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}

function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function(line, y) {
        for (var x = 0; x < line.length; x++)
            grid.set(new Vector(x, y),
                elementFromChar(legend, line[x]));
    });
}

function charFromElement(element) {
    if (element == null)
        return " ";
    else
        return element.originChar;
}

World.prototype.toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    return output;
};

function Wall() {}

var world = new World(plan, {"#": Wall,
    "o": BouncingCritter});
//   #      #    #      o      ##
//   #                          #
//   #          #####           #
//   ##         #   #    ##     #
//   ###           ##     #     #
//   #           ###      #     #
//   #   ####                   #
//   #   ##       o             #
//   # o  #         o       ### #
//   #    #                     #
//   ############################

Grid.prototype.forEach = function(f, context) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var value = this.space[x + y * this.width];
            if (value != null)
                f.call(context, value, new Vector(x, y));
        }
    }
};

World.prototype.turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this);
};

World.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null);
            this.grid.set(dest, critter);
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest))
            return dest;
    }
};

function View(world, vector) {
    this.world = world;
    this.vector = vector;
}
View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
        return charFromElement(this.world.grid.get(target));
    else
        return "#";
};
View.prototype.findAll = function(ch) {
    var found = [];
    for (var dir in directions)
        if (this.look(dir) == ch)
            found.push(dir);
    return found;
};
View.prototype.find = function(ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
};

function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
    this.dir = "s";
}

WallFollower.prototype.act = function(view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != " ")
        start = this.dir = dirPlus(this.dir, -2);
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start) break;
    }
    return {type: "move", direction: this.dir};
};

function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    var handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(this, critter,
            vector, action);
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0)
            this.grid.set(vector, null);
    }
};

actionTypes.grow = function(critter) {
    critter.energy += 0.5;
    return true;
};

actionTypes.move = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    if (dest == null ||
        critter.energy <= 1 ||
        this.grid.get(dest) != null)
        return false;
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest, critter);
    return true;
};

actionTypes.eat = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest != null && this.grid.get(dest);
    if (!atDest || atDest.energy == null)
        return false;
    critter.energy += atDest.energy;
    this.grid.set(dest, null);
    return true;
};

actionTypes.reproduce = function(critter, vector, action) {
    var baby = elementFromChar(this.legend,
        critter.originChar);
    var dest = this.checkDestination(action, vector);
    if (dest == null ||
        critter.energy <= 2 * baby.energy ||
        this.grid.get(dest) != null)
        return false;
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
};

function Plant() {
    this.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function(view) {
    if (this.energy > 15) {
        var space = view.find(" ");
        if (space)
            return {type: "reproduce", direction: space};
    }
    if (this.energy < 20)
        return {type: "grow"};
};

function PlantEater() {
    this.energy = 20;
}
PlantEater.prototype.act = function(view) {
    var space = view.find(" ");
    if (this.energy > 60 && space)
        return {type: "reproduce", direction: space};
    var plant = view.find("*");
    if (plant)
        return {type: "eat", direction: plant};
    if (space)
        return {type: "move", direction: space};
};

var valley = new LifelikeWorld(
    ["############################",
        "#####                 ######",
        "##   ***                **##",
        "#   *##**         **  O  *##",
        "#    ***     O    ##**    *#",
        "#       O         ##***    #",
        "#                 ##**     #",
        "#   O       #*             #",
        "#*          #**       O    #",
        "#***        ##**    O    **#",
        "##****     ###***       *###",
        "############################"],
    {"#": Wall,
        "O": PlantEater,
        "*": Plant}
);

// test: no

// test: no

(function() {
    "use strict";

    var active = null;

    function Animated(world) {
        this.world = world;
        var outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument;
        var node = outer.appendChild(doc.createElement("div"));
        node.style.cssText = "position: relative; width: intrinsic; width: fit-content;";
        this.pre = node.appendChild(doc.createElement("pre"));
        this.pre.appendChild(doc.createTextNode(world.toString()));
        this.button = node.appendChild(doc.createElement("div"));
        this.button.style.cssText = "position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; " +
            "background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;";
        this.button.innerHTML = "stop";
        var self = this;
        this.button.addEventListener("click", function() { self.clicked(); });
        this.disabled = false;
        if (active) active.disable();
        active = this;
        this.interval = setInterval(function() { self.tick(); }, 333);
    }

    Animated.prototype.clicked = function() {
        if (this.disabled) return;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.button.innerHTML = "start";
        } else {
            var self = this;
            this.interval = setInterval(function() { self.tick(); }, 333);
            this.button.innerHTML = "stop";
        }
    };

    Animated.prototype.tick = function() {
        this.world.turn();
        this.pre.removeChild(this.pre.firstChild);
        this.pre.appendChild(this.pre.ownerDocument.createTextNode(this.world.toString()));
    };

    Animated.prototype.disable = function() {
        this.disabled = true;
        clearInterval(this.interval);
        this.button.innerHTML = "Disabled";
        this.button.style.color = "red";
    };

    window.animateWorld = function(world) { new Animated(world); };
})();