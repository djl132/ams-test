/**
 * Created by DerekJLin on 10/13/16.
 */
/////////////////////
////////RETRY////////
/////////////////////

GOAL:

 CHECK A SPECIFIC ERROR!!!!
    1. CREATE AN OBJECT OF INSTANCE ERROR (DERIVE PROTOTYPE FROM THE ERROR.PROROTYPE)
            ALLOWS FOF ERROR CHECKING, ADN METHODS AND PROPERTIES OF A NORMAL ERROR.


//create a function that if it returns a specific exception(multiplicatorunitfailure),
//and tries agains, else throws the exception.

function multiplyTEst(a,b){
    for(;;){

        //try mulitplying until it succeeds;
        try{
            return primitiveMultiply(a,b);
        }

        catch(e) {

            //if not MultiplictorUnitError throw error
            if (!(e instanceof MultiplicatorUnitError))
                throw e;

            console.log(e);
        }
    }
}


//HAVE THE FUNCTION HANDLE THE EXCEPTION UNDER SPECIFIC CONDITIONS
function primitiveMultiply(a, b){

    var prob = Math.floor(Math.random()*2);
    console.log(prob)

    if (prob == 1)
        return a * b;
    else
        throw new MultiplicatorUnitError("mulitplicator unit problem");
}





///create a "Class" that is "an error" and has functions of "Error" - prorotype with Error.prototype
//


//////DOES NOT EVEN HAVE TO HAVE TO BE AN INSTANCE OF ERROR.

//SIMPLER SOLUTION:
    // COULD HAVE JUST DONE
    //function MultiplicatorUnitError(){} with no creation of object
    //becasue CATCH just catches anything that is thrown




function MultiplicatorUnitError(message) {
    //message describing the error
    //derived from Error.prototype
    this.message = message;

    // the below line allows inherit the ability to check for stack information(methods called
    // leading up to the error in order from recent to earliest) in runtime



    ////optional
//The prototype is made to derive from Error.prototype so that instanceof Error will
// also return true for InputError objects. It’s also given a name property since the standard
// error types (Error, SyntaxError, ReferenceError, and so on) also have such a property.
       // The assignment to the stack property tries to give this object
    //a somewhat useful stack trace, on platforms that support it, by creating a r
    // egular error object and then using that object’s stack property as its own.”

    this.stack = (new Error()).stack;
}

//BECAUSE OBEJCTS OF THE SAME PROTOTYPE ARE INSTANCES OF EACH OTHER?????/

//make the error inherit prototype properties such as
// instanceof error that enables us to check if an error is a a specific type of error
MultiplicatorUnitError.prototype = Object.create(Error.prototype)

//specify(override_) name of error instance
MultiplicatorUnitError.prototype.name = "MultiplicatorUnitError";

////////////////////////////////////
///////THE LOCKED BOX///////////////
////////////////////////////////////

//create a function that cleans up code (for example locks up a chest no matter what happens.
//test it by passing a function a callback functoin taht throws an error and then using a finally loop to clean up code.

function withBoxUnlocked(body) {
    var locked = box.locked;
    if (!locked)
        return body();

    box.unlock();
    try {
        return body();
    } finally {
        box.lock();
    }
}

withBoxUnlocked(function() {
    box.content.push("gold piece");
});

try {
    withBoxUnlocked(function() {
        throw new Error("Pirates on the horizon! Abort!");
    });
} catch (e) {
    console.log("Error raised:", e);
}

console.log(box.locked);
// → true