/**
 * Created by DerekJLin on 10/4/16.
 */

//Flattening an Array of Arrays//

    //logic: the function implementation of reduce and other prototype("shared") iterative array methods are higher order functions
    // they take in a callback function, but specify its arguments. ex:  array.reduce(function, starting value)'s (second argument is
    // used as the starting value of the callback function.

var array = [[1,2,3],[4,5,6],["hi", "bonjour", "arigato"]]

array.reduce(
    function(current,next){
        return current.concat(next);
    },[])

//result -> [1, 2, 3, 4, 5, 6, "hi", "bonjour", "arigato"] (9) = $4





//----------------------//

//Average Difference in Ages between mother and child// WHY DOESN'T THIS WORK!!!!!!!!!!


//#1 WAY

function average(array, func) {
    return array.reduce(func,0) / array.length;
}

//1. create a byname function that allows you to create an object that holds a person's name --> person object "database"
//2. make the callback function of reduce take in the (person's birth year - person's mother's birth year)

var byName = {};
ancestry.forEach(function(person) {
    byName[person.name] = person;
});


console.log(average(byName,function(a, b) { return a + (b.born - array[b.mother].born); }));


// → 31.2

//#2 WAY

function average(array) {
    return array.reduce(function(a, b) { return a + (b.born - array[b.mother].born); },0) / array.length;
}

//function difference(a, b) { return a + (b.born - array[b.mother].born); }

//1. create a byname function that allows you to create an object that holds a person's name --> person object "database"
//2. make the callback function of reduce take in the (person's birth year - person's mother's birth year)

var byName = {};
ancestry.forEach(function(person) {
    byName[person.name] = person;
});


console.log(average(byName));


//ANSWERS WAY:

function average(array) {
    function plus(a, b) { return a + b; }
    return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
    byName[person.name] = person;
});

//FILTER THE ARRAY(ONLY PEOPLE WITH MOTHERS) AND TRANSFORM THE FILTERED ARRAY TO
// AN ARRAY OF DIFFERENCES in age between a person and mother
var differences = ancestry.filter(function(person) {
    return byName[person.mother] != null;
}).map(function(person) {
    return person.born - byName[person.mother].born;
});

console.log(average(differences));
// → 31.2

//QUESTIONs:

//1. Why does it keep on telling me that reduce is not a function?
//2.WHICH WAY IS MOST EFFICIENT ADN OPTIMAL, "GOOD CODE"? WHY? PROS AND CONS OF EACH?
//3. ISN'T THE ANSWER MORE INDIRECT, OR LESS ABSTRACT, LESS FLEXIBLE? IT IS DEALING WITH MORE OF THE RAW VALUES


//----------------------//

//Historical Life Expectancy

//GOAL:
//I WANT TO FIND THE AVERAGE LIFE EXPECTANCY FOR EACH CENTURY BASED ON A GIVEN SET OF DATA.

    //LOGIC:
    //1. CREATE AN OBJECT THAT ASSOCIATES ELEMENTS(PERSON) WITH UNIQUE CHARACTERISTIC(CENTURY OF EXISTENCE),
    // BECAUSE I NEED TO BE ABLE TO ACCESS VALUES BASEDON NAME. --> A FUNCTION THAT CALCULATES THE GROUP NUMBER --> GROUPOF().
    //2. using a FOR IN LOOP TO ACCESS AND TRANSFORM EACH ARRAY OF PEOPLE(VALUE) BY CENTURY(PROPERTY) INTO AN ARRAY OF AGES.
    //3. WITH EACH "PROPERTY ITERATION"(CENTURY GROUP) CALCULATE AVERAGE LIFE EXPECTANCY AND PRINT OUT CORRESPONDING AVERAGE LIFE EXPECTANCY.
    //--> AVERAGE(ARRAY) FUNCTION.


function average(array){
    function plus(a,b){return a + b}
    return array.reduce(plus) / array.length
}

function groupBy(array, groupMech){
    var groups = {};

    array.forEach(element){

        var groupNumber = groupMech(element);

        if (groupNumber in groups)
            groups[groupNumber].push(element);
        else
            groups[groupNumber] = [element];
    }

    return groups;
}

//group people by century and put that data into an object
var groupByCentury = groupBy(ancestry, function(person){
    return Math.ceil(person.die / 100);
    }
);

//transform and add
for (var century in groupByCentury){
    var ages = groupByCentury[century].map(function(person){
        return person.died - person.born;
    }

    console.log( century +  ":" + average(ages));
}


//ANSWER:

    //GOAL:
    //FOR EACH CENTURY, I WANT TO FIND THE AVERAGE LIFE EXPECTANCY.


    function average(array) {
        function plus(a, b) { return a + b; }
        return array.reduce(plus) / array.length;
    }

    //CREATES A "TABULATING(TRACKS DATA)" OBJECT THAT CONTAINS DATA THAT GROUPS PEOPLE(IN THE FORM OF AN ARRAY)
    //INTO A GROUP NUMBER PROPERTY BASED ON CENTURY OF EXISTENCE, CALCULATED BY THE GROUPOF(PERSON)
    //FUNCTION

    function groupBy(array, groupMethod) {
        var groups = {};
        array.forEach(function(element) {
            var groupName = groupMethod(element);

            //ANSWERSIS THERE ALREADY
            if (groupName in groups)
            //PUSHING AN ELEMENT AUTOMATICALLY CREATES AN ARRAY AND ADDS THE ELEMENT?
                groups[groupName].push(element);
            else
                groups[groupName] = [element];
        });
        return groups;
    }

    //EXECUTION CODE:

    //CREATES THE TRACKING OBJECT
    var byCentury = groupBy(ancestry, function(person) {
        return Math.ceil(person.died / 100);
    });

    //EXECUTION CODE.
    for (var century in byCentury) {
        var ages = byCentury[century].map(function(person) {
            return person.died - person.born;
        });
        console.log(century + ": " + average(ages));
    }

    // → 16: 43.5
    //   17: 51.2
    //   18: 52.8
    //   19: 54.8
    //   20: 84.7
    //   21: 94

//LIFE EXPECTANCY IS INDEED INCRESASING!!!



//----------------------//



//START HERE -->
//EVERY AND THEN SOME

//GOAL:
    /*
    CREATE A FUNCTION THAT TAKES AN ARRAY AND A FUNCTION(A TEST) AND RETURNS TRUE IF SOME AND ANOTHER ONE THAT RETURN TRUE IF ALL ELEMENTS PASS THE TEST.
     */

    // a function that returns false as soon as one element does not pass
    // a function that return true only when all elements pass
    function every(array, test){
        if (array.forEach(test))
            return true;
       // return false;
    }



    // a function that returns false if none of the elements pass
    // a function that return true as soon as one element passes
    function some()(array, test){

}

function every(array, predicate) {
    for (var i = 0; i < array.length; i++) {
        if (!predicate(array[i]))////////WAHT IS THE FUNCTION OF THIS LINE??? WHAT IS UP WITH USING !'s signs?
            return false;
    }
    return true;
}

function some(array, predicate) {
    for (var i = 0; i < array.length; i++) {
        if (predicate(array[i]))
            return true;
    }
    return false;
}

console.log(every([NaN, NaN, NaN], isNaN));
// → true
console.log(every([NaN, NaN, 4], isNaN));
// → false
console.log(some([NaN, 3, 4], isNaN));
// → true
console.log(some([2, 3, 4], isNaN));
// → false





