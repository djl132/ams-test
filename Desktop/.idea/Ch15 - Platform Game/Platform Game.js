/**
 * Created by DerekJLin on 10/15/16.
 */





key:

Actor --> dynamic element (pos, type, size)

function Level(plan)  {
    this.width = plan[0].length;
    this.height = plan.length;

    this.grid = [];//keeps track of elemnts on map --> array of row arrays
    this.actors = []; //keeps track of state of moving elements --> array of actor objects

    //iterate through row
    for (var y = 0; y < this.height; y++) {


        var line = plan[y];//access first row

        var gridLine = [];// reusable colleciotn type that store elenents in each row, reset for every switch to anothe row

        //iterate thorugh elements in the row and store element and create actor or nonactor accordingly.
        for (var x = 0; x < this.width; x++) {

            //access character of square
            //use a variable to record the kind of sturff that is on the square , later will be changed.
            var ch = line[x], fieldType = null;

            //find which dynamic element to Construct
            var Actor = actorChars[ch]; //actorChars asociates chars on the plan value is name of a Consturctor

            //IF ACTOR , CREATE AN ACTOR
            if (Actor)
                this.actors.push(new Actor(new Vector(x, y), ch));

            //IF NO ACTOR, THEN:
            else if (ch == "x")
                fieldType = "wall";

                //NONMOVING LAVA
            else if (ch == "!")
                fieldType = "lava";

            //add fieldtype
            gridLine.push(fieldType);
        }

        //add the current row elements to the grid
        this.grid.push(gridLine);
    }

    //store player into property of level
    this.player = this.actors.filter(function(actor) {
        return actor.type == "player";
    })[0];
    this.status = this.finishDelay = null;
}



// “This method can be used to find out whether a level is finished:
    Level.prototype.isFinished = function() {

        //CHECK IF GAME IS FINISHED USING THE FINISHDELAY VALUE: <0 :  DONE ? NOT DONE(FALSE)

        // “finishDelay is used to keep the level active for ”
        return this.status != null && this.finishDelay < 0;
    };

function Player(pos)  {

    //PLAYER IS 1.5 SQUARES HIGH
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";










    var simpleLevelPlan = [
    "                      ",
    "                      ",
    "  x              = x  ",
    "  x         o o    x  ",
    "  x @      xxxxx   x  ",
    "  xxxxx            x  ",
    "      x!!!!!!!!!!!!x  ",
    "      xxxxxxxxxxxxxx  ",
    "                      "
];

function Vector(x, y) {
    this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
    return new Vector(this.x * factor, this.y * factor);
};

var actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};


function Lava(pos, ch) {

    this.pos = pos;
    this.size = new Vector(1, 1);

    if (ch == "=") {
        this.speed = new Vector(2, 0);

       //bouncing lava
    } else if (ch == "|") {
        this.speed = new Vector(0, 2);
    }

    //dripping
    else if (ch == "v") {

        //speed = distance/second????
        this.speed = new Vector(0, 3);

        //hits obstacle and starts at orignal position
        this.repeatPos = pos;
    }
}
Lava.prototype.type = "lava";


function Coin(pos) {

    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);

    //GIVES THE Y VALUE A POINT ON TH CURVATURE OF A SIN WAVE.
    // AND RANDOMIZES COINS STARTING POINTS
    this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

var simpleLevel = new Level(simpleLevelPlan);





////MOTION/////

// “The task ahead is to display such levels on the screen and to model time and motion inside them.

//CREATE ELEMENT WITH CLASS
function elt(name, className) {
    var elt = document.createElement(name);
    if (className) elt.className = className;
    return elt;
}

//CREATE LEVEL STARTING WITH A DIV AND ADDING A TABLE (BACKGROUND) TO IT
function DOMDisplay(parent, level) {
    this.wrap = parent.appendChild(elt("div", "game"));
    this.level = level;

    this.wrap.appendChild(this.drawBackground());

    //DIV THAT KEEPS track of actors so drawFRAME CAN REDRAW IF NEEDED
    this.actorLayer = null;
    this.drawFrame();
}

//SCALE THE UNITS - space taken up by one squre on the plan BY 20.
var scale = 20;

DOMDisplay.prototype.drawBackground = function() {
    var table = elt("table", "background");
    table.style.width = this.level.width * scale + "px";

    //TRY MULTIPLYING TABLE' SHIEHGT BY 20 . THEN ADDING ROWS WITH ELEMENTS USING
    // DOUBLE FOR EACHES. ONE FOR ROW AND ONE FOR SQUARE.

    this.level.grid.forEach(function(row) {

        var rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = scale + "px";

        row.forEach(function(type) {
            rowElt.appendChild(elt("td", type));
        });
    });
    return table;
};

// <------------HELP!!!!!----------------->



CANVAS VERSION :


“We have to subtract the viewport’s position when computing the actor’s position since (0,0)
on our canvas corresponds to the top left of the viewport, not the top left of the level. We
could also have used translate for this. Either way works.”





//DRAW ACTORS AND APPEND THEM TO A DIV
DOMDisplay.prototype.drawActors = function() {

    //CREATE A DIV FOR STORING ACTORS
    var wrap = elt("div");

    //ACCESS ACTORS ADN ASSIGN EACH ACTOR  TO ITS CLASS
    this.level.actors.forEach(function(actor) {

        //CREATE ACTORS USING ELEMENT(OBJECT) AND CLASS ASSIGNMENT(ATTRIBUTES)

        //ADD ACTORS TO THE DIV
        var rect = wrap.appendChild(elt("div",
            "actor " + actor.type));

        //SCALE//
        rect.style.width = actor.size.x * scale + "px";
        rect.style.height = actor.size.y * scale + "px";
        rect.style.left = actor.pos.x * scale + "px";
        rect.style.top = actor.pos.y * scale + "px";
    });

    return wrap;
};

////REDRAW ACTORS
////CALLED FOR EACH GENERATOIN OF A NEW FRAME
//////CRETAES AN ACTOR LAYER - ANOTHER FRAME FOR ACTORS...DOES ALL OF THE CHNAGING IN THE GAMES
DOMDisplay.prototype.drawFrame = function() {

    //REDRAW IF NEEDS CLEARING OF CANVAS
    // --> ALREADY HAS A LAYER OF ACTORS DRAWN
    if (this.actorLayer)
        this.wrap.removeChild(this.actorLayer);

    this.actorLayer = this.wrap.appendChild(this.drawActors());

    //change the root element to change th state of each child delemnt,
    // the actors and the background according ot the CSS style sheet nodes
    this.wrap.className = "game " + (this.level.status || "");
    this.scrollPlayerIntoView();
};

//scrolls the palyer into view



////LOOOK OVE RTHIS!!!!!!!/////

DOMDisplay.prototype.scrollPlayerIntoView = function() {
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width / 3;

    // The viewport


    //offsets of the canvas
    var left = this.wrap.scrollLeft;
    var top = this.wrap.scrollTop;
    var right = left + width;
    var bottom = top + height;


    var player = this.level.player;

    //coordiante of the center of tghe player
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

//clear the display

DOMDisplay.prototype.clear = function() {
    this.wrap.parentNode.removeChild(this.wrap);
};

Level.prototype.obstacleAt = function(pos, size) {

    //why round up and down? why not down(floor) for ENDs?
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0)
        return "wall";
    if (yEnd > this.height)
        return "lava";


    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = this.grid[y][x];
            if (fieldType)
                return fieldType;
        }
    }
};

Level.prototype.actorAt = function(actor) {
    for (var i = 0; i < this.actors.length; i++) {
        var other = this.actors[i];


        if (other != actor &&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.pos.y + other.size.y)


            return other;
    }
};

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

Lava.prototype.act = function(step, level) {

    //obtain destination
    var newPos = this.pos.plus(this.speed.times(step));

    //check if there is an obstacle
    if (!level.obstacleAt(newPos, this.size))

        //moves
        this.pos = newPos;

    //check if driping lava
    else if (this.repeatPos)
        this.pos = this.repeatPos;
        //check if bouncind lava
    else
        this.speed = this.speed.times(-1);
};

var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.act = function(step) {

    this.wobble += step * wobbleSpeed;
    var wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys) {
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;

    var motion = new Vector(this.speed.x * step, 0);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle)
        level.playerTouched(obstacle);
    else
        this.pos = newPos;
};

var gravity = 30;
var jumpSpeed = 17;

Player.prototype.moveY = function(step, level, keys) {
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step);

    //SHOULDN'T IT BE REVERSED? SUBTRACT?
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);

    if (obstacle) {
        level.playerTouched(obstacle);

        if (keys.up && this.speed.y > 0)


            //“wo possible outcomes. When the up arrow is pressed and we are moving down
        // (meaning the thing we hit is below us), the speed is set to a relatively large, negative value. ”

            this.speed.y = -jumpSpeed;
        else
            this.speed.y = 0;
    } else {
        this.pos = newPos;
    }
};


Player.prototype.act = function(step, level, keys) {

    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    var otherActor = level.actorAt(this);

    if (otherActor)
        level.playerTouched(otherActor.type, otherActor);

    // Losing animation
    if (level.status == "lost") {
        this.pos.y += step;
        this.size.y -= step;
    }
};



Level.prototype.playerTouched = function(type, actor) {

    //IF LAVA AND GAME NOT OVER YET
    if (type == "lava" && this.status == null) {
        this.status = "lost";
        this.finishDelay = 1;
    }

    else if (type == "coin") {
        //FILTER OUT ACTOR COIN
        this.actors = this.actors.filter(function(other) {
            return other != actor;
        });

        //no more coins
        if (!this.actors.some(function(actor) {
                return actor.type == "coin";
            }))
        {
            this.status = "won";
            this.finishDelay = 1;
        }
    }


};

var arrowCodes = {37: "left", 38: "up", 39: "right"};


//create a A FACTORY CONSTRUCTOR that CREATES AN OBJECT
// THAT TRACKS KEY EVENTS IN ANOTHER OBJEC.

//////WHAT'S THE LOGIC BEHIND THIS?????

//pass in AS an associator AND EVENTLISTENER for keycodes --> arrow keys

function trackKeys(codes) {

    //tracks which arrows were pressed
    var pressed = Object.create(null);

    //create an object with information about key events
    function handler(event) {

        //check if ANY
        if (codes.hasOwnProperty(event.keyCode)) {

            //check if it was keydown event
            var down = event.type == "keydown";

            //store eventname = (boolean value indicating if event is a keydown) into object.
            pressed[codes[event.keyCode]] = down;

            //prevent default scrolling
            event.preventDefault();
        }
    }


    ///listeers that prevent default action of arrowkeys
    // and realtime updates which keys are pressed
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

//BASED ON THE STATE OF THE LEVEL RETRUNED AS A BOOLEAN VALUE(STOP)
// BY A FRAME FUNCTION THAT STOPS THE ANIMATION BASED ON THE STATE OF THE LEVEL

function runAnimation(frameFunc) {
    var lastTime = null;

    //CREATES THE FRAME THROUGH A CALLBACK FUNCTION FRAMEFUNC, PROVIDED BY RUNLEVEL.
    function frame(time) {

        var stop = false;

        //IF IN THE MIDDLE OF A LEVEL
        if (lastTime != null) {

            //determines HOW LONG EACH ANIMATOIN LASTS
            //MAXIMUM 0.1 SECONDS
            var timeStep = Math.min(time - lastTime, 100) / 1000;

            //CONITNUE ANIMATION OR NO?
            //IF LEVEL FINISSHED, STOP ANIMATING AND THEN REQUEST
            // THE FRAME OF THE NEXT LEVEL
            stop = frameFunc(timeStep) === false;
        }

        lastTime = time;

        //IF LEVEL FINISHED AND THERE IS NO NEXT LEVEL
        if (!stop)
            requestAnimationFrame(frame);
    }

    ////////WHERE DOES THE TIME COME FROM??????

    //ANIMATE THE GAME
    requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);


////takes a andThen that determines the status (lost, win, next game) of the game.
function runLevel(level, Display, andThen) {

    var display = new Display(document.body, level);

    //run UI of the level based on status of level
    //return frameFunc : returns a boolena value that determines if ui is updated
    // (in which case a request to update the backend of the UI is made)
    runAnimation(function(step) {

        //BACKEND -

        //step is the gap in frame generatoin ,
        // also how much time an action is given

        //pass in the object that tells the program which key is pressed in realtime
        level.animate(step, arrows);

        //FRONTEND - CREATE ACTOR LAYER
        display.drawFrame(step);

        //IF LEVEL FINISED, RETURN FLASE AND MAKE STOP = TRUE
        // AND WILL STOP REQUESTING FRAMES
        // TO set up teh logic of the next REPAINT.
        if (level.isFinished()) {
            display.clear();

            //check if there is another level
            if (andThen)
                andThen(level.status);

            return false;
        }
    });
}

//plans is hte blueprint for all fo the leevels
function runGame(plans, Display) {

    function startLevel(n) {

        //run the current level, display UI
        //take care of winning and losing and advancemenet thorugh levels
        // using higher order parameter (n), and based on stats(win or lose), run next level,
        // current level, or print congrats.
        runLevel(new Level(plans[n]), Display, function(status) {


            ////do something based on conidtoin of level
            if (status == "lost")
                startLevel(n);

            else if (n < plans.length - 1)
                startLevel(n + 1);

            else
                console.log("You win!");
        });
    }

    startLevel(0);
}