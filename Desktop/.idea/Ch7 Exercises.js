/**
 * Created by DerekJLin on 10/12/16.
 */

function SmartPlantEater() {
    this.energy = 30;
    this.direction = "e";
}
SmartPlantEater.prototype.act = function(view) {
    var space = view.find(" ");

    //don't overpopulate
    if (this.energy > 90 && space)
        return {type: "reproduce", direction: space};

        //don't eat all of the plants
    var plants = view.findAll("*");
    if (plants.length > 1)
        return {type: "eat", direction: randomElement(plants)};

    //PLANT ONLY CHANGES DIRECTIONS IF DIRECTION IS FILLED
    //AND THERE IS AN AVAILABLE SPACE IN ANOTHER DIRECTION
    if (view.look(this.direction) != " " && space)
        this.direction = space;
    return {type: "move", direction: this.direction};
};




///////////////////////
///////predator/////////
///////////////////////


//Goal: Create a natural disaster that keeps the critters from overpopulating.

function Tiger(){
    this.energy = 100;
    this.dir = "w";

    //tracks amount of prey seen in one turn
    this.preySeenPerTurn = [];
}


//determine how the Tiger will act based on location of map
Tiger.prototype.act = function(view) {


    //KEEP TRACK OF HOW MUCH PRAEYSEEN PER TURN
    var preySeenPerTurn = [];

    //empty directions available
    var availDirs = this.view.find(" ")

    //returns an array that is of length number of prey seen in one turn
    var amountOfPreySeen = view.findAll("0");

    //add data each turn
    this.preySeenPerTurn.push(amounOfPreySeen);

    //each turn calculate average sightings/turn
    var preySeenOnAverage = preySeenPerturn.reduce(function(prevpop, currentpop){
        return (prepop,currentpop);
    }, 0)/this.preySeenPerTurn.length;

    if (amountOfPreySeen.length && preySeenOnAverag > 0.35) {

        return {type: "aat", direction: RandomElement(amountOfPreySeen)};
    }





    //eat
    //eat only when the average amount of planteaters/turn > 0.5





    //reproduce
    if (this.energy > 90 && availDirs) {
        return {type: "reproduce", direction: this.direction}
    }




    //move:
    //change directiosn only when going in a filled direction
    // and there is another direction that is empty
    if (view.look(this.dir) != " " && availDirs)
        this.dir = availDirs;

}

    // a way to eat

//a way to reproduce

}
