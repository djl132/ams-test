/**
 * Created by DerekJLin on 10/17/16.
 */





// QUESTIONS:
//
//
//
//
//4. visualize how run Game, runlevel, and runanimation
// ,and aniations work together to run the game


//5. trackkeys - event listener object constructor function? basically a constructor that creates an object whose
// properties are deteremined based on certain conidtions.  USED TO CREATE A DYNAMIC (RESPONSIVE AND TRACKING) DATA STRUCTURE/COLLECTOIN.






//////me look over////

// 1. move*Y comments figure it out.


//represents a level given a plan
function Level(plan){

    this.width = plan[0].length;
    this.height = plan.length;

    //keep track of the state(content changes) of the game
    this.grid = [];

    //keep track of the state(content changes) of the game
    this.actors = [];

    plan.forEach(function(line){

        var gridLine = [];

        line.forEach(function(element){

            var char = element

            var fieldType = null

            //location of element
            var x = line.indexOf(x);
            var y = plan.indexOf(line);

            //construct actor
            if (Actor)
                this.actors.push(new actorChars[char](new Vector(x, y), char))

                //wall
            else if(char == "x")
                fieldType = "wall";

                //nonmoving lava
            else if(char == "!")
                fieldType = "lava";

            //ALL NONMOVING OBJECTS STORED AS FIELDTYPES
            //ALL ACTORS SORED AS OBJECT EXPRESSIONS
            gridLine.push(fieldType);
        })

        //STORE EVERY element in the grid
        this.grid.push(gridLine)
    }

    //IS THERE POTENTIAL TO BE MROE THAN ONE PLAYER
    //extract player(first player property) and store as property
    this.player = this.actors.filter(function(actor) {
        return actor.type == "player"
    })[0];

    ////////WHY IS FINISHDELAY SET TO NULL????? and how is it added to????/

    //finishDelay - keeps track if  win or lose animation finished
    this.status = this.finishDelay = null;

}

//EAch level must be able to check if it is finished
Level.prototype.isFinished = function(){

    return this.status != null && this.finishDelay < 0;
};

function Player(pos){

    //PLAYER IS 1.5 SQUARES HIGH
    this.pos = this.pos.plus(new Vector(0,-0.5));
    this.size = new Vector(0.8,1.5);

    //initial speed of 0
    this.speed = new Vector(0,0);
}

//element IDENTIFIER
Player.prototype.type = "player";




//an expression object representing locations
function Vector(x, y){
    this.x = x;
    this.y = y;
}

//moving and adjusting vectors
Vector.prototype.plus = function(other){

    return new Vector(this.x + other.x, this.y + other.y);
}

//scaling sizes
Vector.prototype.times = function(scale){

    return new Vector(this.x * scale, this.y * scale);
}



var actorChars = {"@": Player, "o": Coin, "=": Lava, "|": Lava, "v": Lava }

function Lava(pos, ch){
    this.pos = pos;
    this.size = new Vector(1,1)

    //HORIZONTAL LAVA
    if(ch == "=")
        this.speed = new Vector(2,0)

        //BOUNCING LAVA
    else if(ch == "|")
        this.speed = new Vector(0,2)

        //DRIPPING LAVA
    else if(char == "v")
        this.speed = new Vector(0,3)
        this.repeatPos = this.pos;
}

Lava.prototype.type = "lava";



function Coin(pos){

    ////why..........
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1))
    this.size = new Vector(0.6, 0.6);


    ////////why//////////
    this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

//className is used to give a html element its proepr appearance using CSS selectors
function elt(tagName, className){
    var elt = document.createElement(tagName)
    if(className)
        elt.className = className;
    return elt;
}


//
function DOMDisplay(parent, level){

    this.wrap = parent.appendChild("game", "div");
    this.level = level;
    this.actorLayer = null;

    //draw backgorund with nonmoving elements - called once
    this.wrap.appendChild(this.drawBackground());

    //draw actor movement
    this.drawFrame();
}

var scale = 20;

DOMDisplay.prototype.drawBackground = function(){
    var table = elt("table", "background");

    ///HOW CAN WE JUST ASSUME THAT THE TD'S WILL FIT in terms of WIDTH???? FROM LEFT TO RIGHT?
    table.style.width = this.level.width * scale + "px";

    this.level.grid.forEach(function(row) {

        //append and store child element
        var row = table.appendChild(elt("tr"));
        row.style.height = scale + "px";

        row.forEeach(function(type){

            //cell matches height
          row.appendChild(elt("td", type));

    });

    });

    return table;

}

//create a separate div tha moves actors
DOMDisplay.prototype.drawActors = function(){

    var container = elt("div")

    this.level.actors.forEach(function(actor){

        var actor = container.appendChild(elt("div", "actor " + actor.type))

        //scale//
        actor.style.width = actor.size.x * scale + "px"
        actor.style.height = actor.size.y * scale + "px"
        actor.style.left = actor.pos.x * scale + "px"
        actor.style.top = actor.pox.y * scale + "px"

    });

    return container;
}


//////THEY CAN OVERLAY THE LAYERS OVER THE BACKGROUND???????
    ./////you remove elements thorugh its parent node right? so to remove the
    // content(child element) of a div, you delette the div using
    // it's parent. you cna't directly delete the the content of the div.

///draws each movement frame(actorLayer)
DOMDisplay.prototype.drawFrame = function(){

    if(this.actorLayer)
        this.wrap.parentNode.removeChild(this.actorLayer);

    //the current frame
    this.actorLayer = this.wrap.appendChild(this.drawActors());

    //draw frame based on status of game
    this.wrap.className = "game" + (this.level.status || "");
    this.scrollPlayerIntoView();
}


DOMDisplay.prototype.clear = function(){

    this.wrap.parentNode.removeChild(this.wrap);
}





/////DO LATER....... HELP......
DOMDisplay.prototype.scrollPlayerIntoView = function(){

    //canvas' absolute position
     var width = this.wrap.clientWidth;
     var height = this.wrap.clientHeight;

    //1/3 of screen
     var margin = width / 3;

    // // The viewpor
     var left = this.wrap.scrollLeft, right = left + width;
     var top = this.wrap.scrollTop, bottom = top + height;

     var player = this.level.player;
     var center = player.pos.plus(player.size.times(0.5))
         .times(scale);

     if (center.x < left + margin)
         this.wrap.scrollLeft = center.x - margin;
     else if (center.x > right - margin)
         this.wrap.scrollLeft = center.x + margin - width;
     if (center.y < top + margin)
         this.wrap.scrollTop = center.y - margin;
     else if (center.y > bottom - margin)
         this.wrap.scrollTop = center.y + margin - height;
};




//RETURNS TYPE OF OBSTACLE AT the LOCATION OF An
// element given its POSITION and size
Level.prototype.obstacleAt = function(pos, size){

    //get coordinates of
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y)
    var yEnd = Math.ceil(pos.y + size.y);

    if(xStart < 0 || xEnd > this.width || yStart < 0)
        return "wall";

    ////HOW?????
    if(yEnd > this.height)
        return "lava";

    //
    for(var y = yStart; y < yEnd; y++)
        for(var x = xStart; x < xEnd; x++)

            if(var elementType = this.grid[y][x])
                return elementType;
}


////HOW DOES THIS CHECK LOCATION?????
Level.prototype.actorAt = function(actor){

    //check for actors
    for(var i = 0; i < this.actors.length; i++){
        var other = this.actors[i];


        /////HOW DOES THIS CHECK LOCATION??????!!!!
        if (other != actor &&
        actor.pos.x + actor.size.x > other.x
        && other.x + other.pos > actor.pos.x
            && actor.pose.y + actor.size.y > other.y
            && other.pos.y + other.size.y > actor.y)

            return other;
    }
}


//maximumTime
var maxStep = 0.05;

/////WHAT DOES STEP REPRESENT????

Level.prototype.animate = function(step, keys) {


    ////////WHAT DOES THIS LINE DO???
    if(this.status != null)
        this.finishDelay -= step;

    while(step > 0){

        //thisStep --> the actual time given to each element to act,
        // given the total time given for each animation cycle.
        //the time given to each element to act
        //cannot be > 0.05 seconds(maxStep)
        var thisStep = Math.(step, maxStep);

        this.actors.forEach(function(actor){
            actor.act(thisStep, this, keys)

        });

    }
}




//maximum amount of time given to each act
var maxStep = 0.05;

//keys associates
Level.prototype.animate = function(step, keys) {

    //CHECK IF GAME OVER(WON OR LOST)
    if (this.status != null)

    //decrement the time until game over
        this.finishDelay -= step;

    //CHECK IF GAME IS CONITNUING

    //set the steptimes
    //have all dynamic elements act according to level(obstacles or not) and key values(players)
    //each time around substract
    while (step > 0) {

        //no step larger than max step is taken
        var thisStep = Math.min(step, maxStep);

        this.actors.forEach(function(actor) {

            //actor acts acoording to timestep, level map(surroundings) and arrow keys pressed
            //keys - object that matches
            actor.act(thisStep, this, keys);
        }, this);

        //decrement step time to count time acted.
        step -= thisStep;
    }
};

Lava.prototype.act = function(step, level){

    var newPos = this.pos.plus(this.speed.times(step));

    //obstacle
    if(!level.obstacleAt(newPos,this.size))
        this.pos = newPos;

    //no obstacle
        //dripping lava
    else if(this.repeatPos)
        this.pos = this.repeatPos

        //bouncing lava
    else
        this.speed = this.speed.times(-1);
}


///////what exactly is wobble??????

//////TEXT///////



var wobbleSpeed = 8, wobbleDis = 0.07;

Coin.prototype.act = function(step){

    ///WHAT IS THIS VALUE??????
    this.wobble += step * wobbleSpeed;

    //WHAT IS THIS!!!!!!!
    var wobblePos = Math.sin(this.wobble) * wobbleDist;

    this.pos = this.basePos.plus(new Vector(0, wobblePos))
}

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys){
    this.speed.x = 0;

    if(keys.left)
        this.speed -= playerXSpeed
    if(keys.right)
        this.speed += playerXSpeed

    var newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    var obstacle = level.obstacleAt(newPos);


    //know what we are going to do with the obstacle
    if (obstacle)
        level.playerTouched(obstacle)

    this.pos = newPos;

}


var gravity = 30;
var jumpSpeed = 17;

/////hwo do we nknow that t/**
* Created by DerekJLin on 10/17/16.
*/





// QUESTIONS:
//
//
//
// 1. ANIMATE
// 2. FRAME(TIME) first time is taken from where? the argument?
//
//     3.scrollplayer in view - visualize it
//4. visualize how run Game, runlevel, and runanimation
// ,and aniations work together to run the game
//5. trackkeys - event listener object constructor function? basically a constructor that creates an object whose
// properties are deteremined based on certain conidtions.  USED TO CREATE A DYNAMIC (RESPONSIVE AND TRACKING) DATA STRUCTURE/COLLECTOIN.






//////me look over////

// 1. move*Y comments figure it out.


//represents a level given a plan
function Level(plan){

    this.width = plan[0].length;
    this.height = plan.length;

    //keep track of the state(content changes) of the game
    this.grid = [];

    //keep track of the state(content changes) of the game
    this.actors = [];

    plan.forEach(function(line){

        var gridLine = [];

        line.forEach(function(element){

            var char = element

            var fieldType = null

            //location of element
            var x = line.indexOf(x);
            var y = plan.indexOf(line);

            //construct actor
            if (Actor)
                this.actors.push(new actorChars[char](new Vector(x, y), char))

            //wall
            else if(char == "x")
                fieldType = "wall";

            //nonmoving lava
            else if(char == "!")
                fieldType = "lava";

            //ALL NONMOVING OBJECTS STORED AS FIELDTYPES
            //ALL ACTORS SORED AS OBJECT EXPRESSIONS
            gridLine.push(fieldType);
        })

        //STORE EVERY element in the grid
        this.grid.push(gridLine)
    }

    //IS THERE POTENTIAL TO BE MROE THAN ONE PLAYER
    //extract player(first player property) and store as property
    this.player = this.actors.filter(function(actor) {
        return actor.type == "player"
    })[0];

    ////////WHY IS FINISHDELAY SET TO NULL????? and how is it added to????/

    //finishDelay - keeps track if  win or lose animation finished
    this.status = this.finishDelay = null;

}

//EAch level must be able to check if it is finished
Level.prototype.isFinished = function(){

    return this.status != null && this.finishDelay < 0;
};

function Player(pos){

    //PLAYER IS 1.5 SQUARES HIGH
    this.pos = this.pos.plus(new Vector(0,-0.5));
    this.size = new Vector(0.8,1.5);

    //initial speed of 0
    this.speed = new Vector(0,0);
}

//element IDENTIFIER
Player.prototype.type = "player";




//an expression object representing locations
function Vector(x, y){
    this.x = x;
    this.y = y;
}

//moving and adjusting vectors
Vector.prototype.plus = function(other){

    return new Vector(this.x + other.x, this.y + other.y);
}

//scaling sizes
Vector.prototype.times = function(scale){

    return new Vector(this.x * scale, this.y * scale);
}



var actorChars = {"@": Player, "o": Coin, "=": Lava, "|": Lava, "v": Lava }

function Lava(pos, ch){
    this.pos = pos;
    this.size = new Vector(1,1)

    //HORIZONTAL LAVA
    if(ch == "=")
        this.speed = new Vector(2,0)

    //BOUNCING LAVA
    else if(ch == "|")
        this.speed = new Vector(0,2)

    //DRIPPING LAVA
    else if(char == "v")
        this.speed = new Vector(0,3)
    this.repeatPos = this.pos;
}

Lava.prototype.type = "lava";



function Coin(pos){

    ////why..........
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1))
    this.size = new Vector(0.6, 0.6);


    ////////why//////////
    this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

//className is used to give a html element its proepr appearance using CSS selectors
function elt(tagName, className){
    var elt = document.createElement(tagName)
    if(className)
        elt.className = className;
    return elt;
}


//
function DOMDisplay(parent, level){

    this.wrap = parent.appendChild("game", "div");
    this.level = level;
    this.actorLayer = null;

    //draw backgorund with nonmoving elements - called once
    this.wrap.appendChild(this.drawBackground());

    //draw actor movement
    this.drawFrame();
}

var scale = 20;

DOMDisplay.prototype.drawBackground = function(){
    var table = elt("table", "background");

    ///HOW CAN WE JUST ASSUME THAT THE TD'S WILL FIT in terms of WIDTH???? FROM LEFT TO RIGHT?
    table.style.width = this.level.width * scale + "px";

    this.level.grid.forEach(function(row) {

        //append and store child element
        var row = table.appendChild(elt("tr"));
        row.style.height = scale + "px";

        row.forEeach(function(type){

            //cell matches height
            row.appendChild(elt("td", type));

        });

    });

    return table;

}

//create a separate div tha moves actors
DOMDisplay.prototype.drawActors = function(){

    var container = elt("div")

    this.level.actors.forEach(function(actor){

        var actor = container.appendChild(elt("div", "actor " + actor.type))

        //scale//
        actor.style.width = actor.size.x * scale + "px"
        actor.style.height = actor.size.y * scale + "px"
        actor.style.left = actor.pos.x * scale + "px"
        actor.style.top = actor.pox.y * scale + "px"

    });

    return container;
}


//////THEY CAN OVERLAY THE LAYERS OVER THE BACKGROUND???????
    ./////you remove elements thorugh its parent node right? so to remove the
    // content(child element) of a div, you delette the div using
    // it's parent. you cna't directly delete the the content of the div.

///draws each movement frame(actorLayer)
    DOMDisplay.prototype.drawFrame = function(){

    if(this.actorLayer)
        this.wrap.parentNode.removeChild(this.actorLayer);

    //the current frame
    this.actorLayer = this.wrap.appendChild(this.drawActors());

    //draw frame based on status of game
    this.wrap.className = "game" + (this.level.status || "");
    this.scrollPlayerIntoView();
}


DOMDisplay.prototype.clear = function(){

    this.wrap.parentNode.removeChild(this.wrap);
}





/////DO LATER....... HELP......
DOMDisplay.prototype.scrollPlayerIntoView = function(){
    // var width = this.wrap.clientWidth;
    // var height = this.wrap.clientHeight;
    // var margin = width / 3;
    //
    // // The viewport
    // var left = this.wrap.scrollLeft, right = left + width;
    // var top = this.wrap.scrollTop, bottom = top + height;
    //
    // var player = this.level.player;
    // var center = player.pos.plus(player.size.times(0.5))
    //     .times(scale);
    //
    // if (center.x < left + margin)
    //     this.wrap.scrollLeft = center.x - margin;
    // else if (center.x > right - margin)
    //     this.wrap.scrollLeft = center.x + margin - width;
    // if (center.y < top + margin)
    //     this.wrap.scrollTop = center.y - margin;
    // else if (center.y > bottom - margin)
    //     this.wrap.scrollTop = center.y + margin - height;
};




//RETURNS TYPE OF OBSTACLE AT the LOCATION OF An
// element given its POSITION and size
Level.prototype.obstacleAt = function(pos, size){

    //get coordinates of
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y)
    var yEnd = Math.ceil(pos.y + size.y);

    if(xStart < 0 || xEnd > this.width || yStart < 0)
        return "wall";

    ////HOW?????
    if(yEnd > this.height)
        return "lava";

    //
    for(var y = yStart; y < yEnd; y++)
        for(var x = xStart; x < xEnd; x++)

            if(var elementType = this.grid[y][x])
    return elementType;
}


////HOW DOES THIS CHECK LOCATION?????
Level.prototype.actorAt = function(actor){

    //check for actors
    for(var i = 0; i < this.actors.length; i++){
        var other = this.actors[i];


        /////HOW DOES THIS CHECK LOCATION??????!!!!
        if (other != actor &&
            actor.pos.x + actor.size.x > other.x
            && other.x + other.pos > actor.pos.x
            && actor.pose.y + actor.size.y > other.y
            && other.pos.y + other.size.y > actor.y)

            return other;
    }
}


//maximumTime
var maxStep = 0.05;

/////WHAT DOES STEP REPRESENT????

Level.prototype.animate = function(step, keys) {


    ////////WHAT DOES THIS LINE DO???
    if(this.status != null)
        this.finishDelay -= step;

    while(step > 0){

        //thisStep --> the actual time given to each element to act,
        // given the total time given for each animation cycle.
        //the time given to each element to act
        //cannot be > 0.05 seconds(maxStep)
        var thisStep = Math.(step, maxStep);

        this.actors.forEach(function(actor){
            actor.act(thisStep, this, keys)

        });

    }
}




//maximum amount of time given to each act
var maxStep = 0.05;

//keys associates
Level.prototype.animate = function(step, keys) {

    //CHECK IF GAME OVER(WON OR LOST)
    if (this.status != null)

    //decrement the time until game over
        this.finishDelay -= step;

    //CHECK IF GAME IS CONITNUING

    //set the steptimes
    //have all dynamic elements act according to level(obstacles or not) and key values(players)
    //each time around substract
    while (step > 0) {

        //no step larger than max step is taken
        var thisStep = Math.min(step, maxStep);

        this.actors.forEach(function(actor) {

            //actor acts acoording to timestep, level map(surroundings) and arrow keys pressed
            //keys - object that matches
            actor.act(thisStep, this, keys);
        }, this);

        //decrement step time to count time acted.
        step -= thisStep;
    }
};

Lava.prototype.act = function(step, level){

    var newPos = this.pos.plus(this.speed.times(step));

    //obstacle
    if(!level.obstacleAt(newPos,this.size))
        this.pos = newPos;

    //no obstacle
    //dripping lava
    else if(this.repeatPos)
        this.pos = this.repeatPos

    //bouncing lava
    else
        this.speed = this.speed.times(-1);
}


///////what exactly is wobble??????

//////TEXT///////



var wobbleSpeed = 8, wobbleDis = 0.07;

Coin.prototype.act = function(step){

    ///WHAT IS THIS VALUE??????
    this.wobble += step * wobbleSpeed;

    //WHAT IS THIS!!!!!!!
    var wobblePos = Math.sin(this.wobble) * wobbleDist;

    this.pos = this.basePos.plus(new Vector(0, wobblePos))
}

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys){
    this.speed.x = 0;

    if(keys.left)
        this.speed -= playerXSpeed
    if(keys.right)
        this.speed += playerXSpeed

    var newPos = this.pos.plus(new Vector(this.speed.x * step, 0));
    var obstacle = level.obstacleAt(newPos);


    //know what we are going to do with the obstacle
    if (obstacle)
        level.playerTouched(obstacle)

    this.pos = newPos;

}


var gravity = 30;
var jumpSpeed = 17;

///////FOR EACH FRAME AND TIMESTEP(MOVEY), WE CALL THE MOVEY FUNCTION AND DO STUFF ACCORDING TO IS CALCUALTED DIRECTION.
//IF AT THE MOMENT THE EEND FRAME PRODUCES A DESTINATION
////WHEN IS THE PLAYER GIVEN THE OPPORTUNITY TO MOVE IN THE ANIMATE? I'M CONFUSED.....
///////////how are the keys conneted to the moveY an moveX?
Player.prototype.moveY = function(step, level, keys) {

    //speed with gravity
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step)

    var newPos = this.pos.plus(motion);
    var obstacle = obstacleAt(newPos);

    //encounter bstacle
    if (obstacle) {
        level.playerTouched(obstacle);


        ///WHEN IT'S ABOUT TO HIT THE GROUND
        if (keys.up && this.speed.y > 0)

        //“wo possible outcomes. When the up arrow is pressed and we are moving down
        // (meaning the thing we hit is below us), the speed is set to a relatively large, negative value. ”

        /////the obstacle is under player
            this.speed.y = -jumpSpeed
        else

        ////the obstacle is above?///
            this.speed.y = 0;
    }

    else{
        this.pos = newPos;
    }

}


////WHEN IS THE PLAYER GIVEN THE OPPORTUNITY TO MOVE IN THE ANIMATE? I'M CONFUSED.....
///////////how are the keys conneted to the moveY an moveX?
Player.prototype.moveY = function(step, level, keys) {

    //speed with gravity
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step)

    var newPos = this.pos.plus(motion);
    var obstacle = obstacleAt(newPos);

    //encounter bstacle
    if (obstacle) {
    level.playerTouched(obstacle);

    if (keys.up && this.speed.y > 0)

    //“wo possible outcomes. When the up arrow is pressed and we are moving down
    // (meaning the thing we hit is below us), the speed is set to a relatively large, negative value. ”

    /////whyyyyyyyyyYYYY?????./////
        this.speed.y = -jumpSpeed
    else

        /////why?????
        this.speed.y = 0;
    }

    else{
        this.pos = newPos;
    }

}



Player.prototype.act = function(step, level, keys){

    //move x and y position fo character basrd on key pressed

    this.moveX(step,level,keys);
    this.moveY(step, level, keys);


    //check if there is another actor at the destination AND record touch
    var otherActor = level.actorAt(this)

    if(otherActor)
        level.playerTouched(otherActor.type, otherActor)

    //play losing animation
    if(level.status == "lost"){

        this.pos.y -= step;
        this.size.y-= step;
    }

}

//update game based on type of elment the player touched
Level.prototype.playerTouched = function(type, actor){

    //touched lava --> death
    if(type == lave && this.status == null){
        this.status = "lost";

        //WHY IS FINISHDELAY = 1????
        this.finishDelay = 1;
    }

    //collect coins if there are anymore, if not WIN
    else if(type = "coin"){
        this.actors = this.actors.filter(function(other{
            return other != actor;
        }))

        if(!this.actors.some(function(actor){

            return actor.type == "coin";

            }))

            this.status = "won"
            this.finishDelay = 1;
    }
}

var arrowCodes = {37: "left", 38: "up", 38: "down", 39: "right"}

//////facotry function constructor???
function trackKeys(codes){

    var pressed = Object.create(null);

    function handler(event){

        if(codes.hasOwnProperty(event.keyCode)){

            var down = event.type == "keyDown"

            pressed[codes[event.keyCode]] = down;

            event.preventDefault();
        }
    }

    addEventListener("keydown", handler)
    addEventListener("keyup", handler)

    return pressed;
}
//////////////////////////////////////////////////////////////////////
/////modified nonleaking event listeners trackKeys() method///////////
//////////////////////////////////////////////////////////////////////

<!doctype html>
<script src="code/chapter/15_game.js"></script>
    <script src="code/game_levels.js"></script>

    <link rel="stylesheet" href="css/game.css">

    <body>
    <script>
    // To know when to stop and restart the animation, a level that is
    // being displayed may be in three states:
    //
    // * "yes":     Running normally.
    // * "no":      Paused, animation isn't running
    // * "pausing": Must pause, but animation is still running
    //
    // The key handler, when it notices escape being pressed, will do a
    // different thing depending on the current state. When running is
    // "yes" or "pausing", it will switch to the other of those two
    // states. When it is "no", it will restart the animation and switch
    // the state to "yes".
    //
    // The animation function, when state is "pausing", will set the state
    // to "no" and return false to stop the animation.

    function runLevel(level, Display, andThen) {
        var display = new Display(document.body, level);
        var running = "yes";

        //PAUSE GAME IF
        function handleKey(event) {

            //if we hit ESC, change running value
           if (event.keyCode = 27)

               if(running = "no")
                    running = "yes";

                //if puased
                } else if (running == "pausing") {
                    running = "yes";

                    //PAUSING STATE IN THE MIDDLE Of an execution.
                } else if (running == "yes") {
                    running = "pausing";
                }
            }
        }

        //ESC KEY LISTENER FOR PAUSING GAME

//returns boolearn value that determines whether or not to keep on animating
        function animation(step) {

            //set animation to not running
            if(running = "pausing") {
                running = "no"
                return false;
            }


            level.animate(step, arrows);
            display.drawFrame(step);
            if (level.isFinished()) {
                display.clear();


                // Here we remove all our event handlers
                removeEventListener("keydown", handleKey);
                arrows.unregister(); // (see change to trackKeys below)


                if (andThen)
                    andThen(level.status);
                return false;
            }
        }
        runAnimation(animation);
    }

function trackKeys(codes) {
    var pressed = Object.create(null);
    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var state = event.type == "keydown";
            pressed[codes[event.keyCode]] = state;
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);


    //enable trackKeys object to unregister its handlers.

    // This is new -- it allows runLevel to clean up its handlers
    pressed.unregister = function() {
        removeEventListener("keydown", handler);
        removeEventListener("keyup", handler);
    };
    // End of new code
    return pressed;
}

runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>




function runGame(plans, Display){

    function startLevel(n, lives){

        //run level and pass in callback that determines advancemenet in terms of levels
        runLevel(new Level(plans[n]), Display, function(status){

            //if lost the game, check if there are lives left
        if (status == lost)
            //if still have lives left
            if(lives > 0) {
                // start level with one less life
                startLevel(n, lives - 1);
            }
            else
                console.log(you lost!)
            //restart level
                startLevel(0,3);

        //did not
        else if(n < plans.length - 1)
            startLevel(n + 1)
        else
            contains.log("You win!")


    }

    startLevel(0,3)
}


//set up UI
    //animate(runAnimation) based on status of game
function runLevel(level, Display, andThen) {

    var display = new DOMDisplay(document.body, level);

    runAnimation(function(step) {

        if (!paused) {

            level.animate(step, arrows);

            display.drawFrame(step);

            if (level.isFinished()) {
                display.clear()

                if (andThen)
                    andThen(level.status)

                return false;
            }
        }

    });
}


//run the animation based on the status(isFinished or no) of the level
function runAnimation(frameFunc){

    var lastTime = null;

    //takes in current time and aDETERMINE FRAME DURATIONS
    function frame(time) {

        var stop = false;

        //maximum duration of 0.1 second for each frame ahimation
        var timeStep = Math.min(time - lastTime, 100) /1000

        stop = frameFunc(timeStep) == false;

        lastTime = time;

        if(!stop)
            requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}


}
























