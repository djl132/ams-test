/**
 * Created by DerekJLin on 10/14/16.
 */




///////THE SUM OF A RANGE/////////

function range(start, end, step) {

    if (step == null) step = 1;
    var array = [];

    if (step > 0) {
        for (var i = start; i <= end; i += step)
            array.push(i);
    } else {
        for (var i = start; i >= end; i += step)
            array.push(i);
    }
    return array;
}

function sum(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++)
        total += array[i];
    return total;
}

///////REVERSING AN ARRAY/////////

//reverse an array by creating another array
function reverseArray(array) {
    var output = [];
    for (var i = array.length - 1; i >= 0; i--)
        output.push(array[i]);
    return output;
}

//reverse an array without creatign another array
function reverseArrayInPlace(array) {
    //odd lengthed arrays have a middle value that does not have to be changed
    //just change the other non-middle values
    //index at which reversing terminates = numberofelementinarry/2 rounded down.
    //middle is left untouched.

    //LOGIC
    //if you need to swap values, store one value,
    //change that value, and then use that value to change the other value later
    for (var i = 0; i < Math.floor(array.length / 2); i++) {
        var old = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = old;
    }
    return array;
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]


///////A LIST///////////////////


//BECAUSE A LIST IS BASICLALY OBJECTS WITH A VALUE POINTING TO OTHER OBJECTS WITH A VALUE
//IN ORDER TO CONVERT AN ARRAY TO A LIST YOU YOU ITEATE THOUGH THE ARRAY DN CREATE OBJECTS CONTIANING THE CURRENT ITERATION VALUE.
//

STUPID WAY: -----> : previous object si doing the pointing.
    YOU NEED TO STORE A REFERENCE TO TH LAST ONE ALWAYS IN ORDER TO POINT THAT LAST ONE TO THE CURRENT ONE
SMART WAY: <----- : curent object is doing the pointing.
    START from THE LAST NODE("next node" aka  var list ) WITH the LAST VALUE AND store IT AND THEN CRATE ANOTEHR LIST TAHT POINT TO THE "NEXT node".


/////stupID WAY/////
function arrayToList(array){
    iterate through elements of array
    create a new object that makes value property the element
    and the rest property anothe object
    recursively call arrayToList


    var list = {};

    for (var i = 0; i < array.length; i++) {

        var list = {value: [array[0], rest:null}

        //on first iteratoin don't reference last node because there is none
        //pointing is done here
        if (i != 0)
            last.rest = list;

        //store previous node
        var last = list


    }
}


SMART WAY:

function listToArray(list){
    array = [];

    //move node at the end of each iteration
    //stop when the current node points to null
    for(var node = list; node; node = node.rest)
        array.push(node.value)
    return array;
}

//add a value to the front of a list
    function prepend(value, list) {
        return {value: value, rest: list};
    }


    ////////LOOOK OVER WHEN YOU GET THE CHANCE!!!!!!!!!!!!////
////return value of nth node in a list.
function nth(list, n) {
        if (!list)
            return undefined;
        else if (n == 0)
            return list.value;

        //recursive call, accessing each node's node until the
        // counter is 0 and you've iterated through enough nodes(2 nodes if n = 3) and return the value of that last node
            //decrement, move to next , decrement, move to next node,
        else
            return nth(list.rest, n - 1);
    }











/////////////////////////
////DEEP COMPARISON//////
/////////////////////////

//CODING PRINCIPLE:
//USE RECURSION WHEN YOU HAVE AN EXECUTION AND
//and there is a possible  instance in which that function(such as comparing values of objects' properties)
//will have to do a similar task.
function deepEqual(a,b) {


    var numberOfPropsInA = 0;
    var numberOfPropsInB = 0;

    //check if primitive type or object
    // if not check if one of them is an object
    if (a === b)
        return true;


    //if not object or null, return false
    if (typeof a != object || a == null || typeof b != object || b == null)
        return false;

    //iterate throuh properties
    for (var prop in a) {

        numberOfPropsInA++;

        //check if other has prop and if its value is equal
        //for checking equality, USE RECURSIVE CALL TO DEEP EQUALS
        if (!(prop in b) && !deepEqual(a[prop], b[prop]))
            return false
        numberOfPropsInB++;

    }

    //check if they have the same number of properties.
    return numberOfPropsInA == numberOfPropsInB
}


//////////DEEP COMPARISON///////////

//////QUESTION: HOW DOES THIS CODE HANDLE PRIMITIVE TYPES !=ING?


