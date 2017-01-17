/**
 * Created by DerekJLin on 10/19/16.
 */

questions:

1. where does all check if the empty array like does the foreach just know?

//CEATE A FUNCTION THAT GETS A URL, PARSES IT'S INFO, INFO AND THEN PUTS IT A PROMISE AND RETURNS THAT PROMISE.


///CREATE FUNCTION
//TAKE IN ARRAY OF PROMISESE, PERFROMS EACH REQUEST AND STRINGS TOGETHER ANOTEHR(MAPS ANOTHER) ARRAY WITH THE RETURN VALUES AND A PROMISE THER.
//IF ANY REQUESTS FAIL, A PROMISE CONTAINING INFORMATION ABOUT THE ERROR RESPONSE IS RETURBNED.

//logic:

create a promise that takes in an array of promises and then does something wiht it, the specificiation ofwhich is specified later in its execution code. However,
    we want all the promise to fail as soon as one of it spromises fail, or reading of the array doesn't reach the end. and succeed, if it does.

function all(promises){

    //return a promise that resolves(takes on the value of) to an array of promises that were successful in
    // their asynchronous processes and then does somethign with it. if it fails, exit out. create a counter that
    //tells you that you are at the end of the liest.
    return new Promise(function(succeed,fail){

        var results = []; pending = promises.length;

        //go through each prmise and fail if one of ht epromieses doens't go thorugh or succeed if they ALL go through.

        //COLLECT ARRAY of successful promisea nd err out if any of them failed
        promises.forEach(function(promise,i) {
            //create a new promise that

            //takes in the response data
            promise.then(function (result) {

                results[i] = result;
                pendin -= 1;

                //reached end of array
                if (pending == 0)
                    succeed(results);

            //takes in the error

            }, function(error){

                fail(error);
            });

        });

    //if empty array.
        if (pending == 0){
            succeed(results)
        }
});

}












/////creates a promise that contains t


function all(promises) {



    /////CREATES A PROMISE OBJECT THAT CALLS THE THEN FUNCTOIN AND RETURNS ONLY THAT FUNCTION
    // WHEN IT SUCCEEDS, WHICH CALLS THE HIGHER-ORDER SUCCEED FUNCTION WEN IT SUCCEEDS.
    return new Promise(function(succeed, fail) {

        var results = [], pending = promises.length;

        //go thorugh each promise and handle based on whether or not it was successful
        promises.forEach(function(promise, i) {

            //creates a new promise and adds it's handles.\
            //success --> appends the resulting  to results
            //error --> calls succeed.
            promise.then(function(result) {

                results[i] = result;
                pending -= 1;

                if (pending == 0)
                    succeed(results);

            }, function(error) {
                fail(error);

            });


        });

        if (promises.length == 0)
            succeed(results);
    });
}

// Test code.
all([]).then(function(array) {
    console.log("This should be []:", array);
});

//execute a
function soon(val) {
    return new Promise(function(success) {
        setTimeout(function() { success(val); },
            Math.random() * 500);
    });
}


///CREATE AN ARRAY OF PROMISES
//////THEN() SPECIFIES THE IMPLEMENATAION OF SUCCESS.

all([soon(1), soon(2), soon(3)]).then(function(array) {
    console.log("This should be [1, 2, 3]:", array);
});

function fail() {
    return new Promise(function (success, fail) {
        fail(new Error("boom"));
    });
}

////RETURNS  PROMISE THAT FAILS.
all([soon(1), fail(), soon(3)]).then(function(array) {
    console.log("We should not get here");
}, function(error) {
    if (error.message != "boom")
        console.log("Unexpected failure:", error);
});

