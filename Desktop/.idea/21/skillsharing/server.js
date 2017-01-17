/**
 * Created by DerekJLin on 10/27/16.
 */



//////THIS CODE RESPONDS DIRECTLY TO METHOD REQUESTS AND FILE REQUESTS USING THE HTTP MODULE TO CREATE A SERVER.
//ADDS SERVER MTHODS AND ASSISTING HELPER FUNCTIONS.


///LOGIC:
//    SERVER USES AN OBJECT INTERFACE(router object) TO HANDLE REQUESTS.

var http = require("http");



var Router = require("./router");

//import module
var ecstatic = require("ecstatic");

// “root option to tell the server where it should look for files. ”
var fileServer = ecstatic({root: "./public"});

//import object interface that provides method request handling INTERFACE.
var router = new Router();

//CREATE A SERVER LISTENING ON PORT 8000- HANDLES METHOD AND FILE REQUESTS
http.createServer(function(request, response) {

    //if REQUEST IS A METHOD
    //RESOLVE
    //IF NOT A REQUEST METHOD
    //RETRIEVE FILE THROUGH FILESERVER
    if (!router.resolve(request, response))

    //specifies the server as a file server
        fileServer(request, response);

}).listen(8000);




//sends response
function respond(response, status, data, type) {

    response.writeHead(status, {
        "Content-Type": type || "text/plain"});
    ///WHEN RESPONSE IS READY.

    response.end(data);
}

//return response that is type: JSON and convert data to JSON.
function respondJSON(response, status, data) {
    respond(response, status, JSON.stringify(data),
        "application/json");
}

// “The server keeps the talks that have been proposed
// in an object called talks, whose property names are
// the talk titles. These will be exposed as HTTP resources
// under /talks/[title], so we need to add handlers to our
// router that implement the various methods that clients can
// use to work with them.”

// “  talks[title] = {title: title,
//   presenter: talk.presenter,
//   summary: talk.summary,
//   comments: []};”

var talks = Object.create(null);


//get as specific talk
router.add("GET", /^\/talks\/([^\/]+)$/,
    function(request, response, title) {
        if (title in talks)
            respondJSON(response, 200, talks[title]);
        else
            respond(response, 404, "No talk '" + title + "' found");
    });

router.add("DELETE", /^\/talks\/([^\/]+)$/,
    function(request, response, title) {
        if (title in talks) {
            delete talks[title];
            //update clients on the change
            registerChange(title);
        }
        respond(response, 204, null);
    });


//parses data from the response in frames and handles it in a callback func.
function readStreamAsJSON(stream, callback) {

    var data = "";//keeps track of data sent in bursts

    //add chunks of request
    stream.on("data", function(chunk) {
        data += chunk;
    });

    //when data requests are done, parse them into JSON objects.
    stream.on("end", function() {
        var result, error;
        try {
            result = JSON.parse(data);
        }
            //if contains bad request
        catch (e) {
            error = e;
        }
        callback(error, result);
    });

    //handle error
    stream.on("error", function(error) {
        callback(error);
    });
}


//add talks
router.add("PUT", /^\/talks\/([^\/]+)$/,

    //METHOD:

    //from the url take in the title of the talk using a regular expression
    //take in the response and request data(parsing the data) adn handling
    // the resulting talk JSON object or an error.
    function(request, response, title) {

        //parse the request for informatoin about the request
        readStreamAsJSON(request, function(error, talk) {

            //if client error
            if (error) {
                respond(response, 400, error.toString());
            }

            //if talk and its properties exists
            else if (!talk ||
                typeof talk.presenter != "string" ||
                typeof talk.summary != "string") {

                respond(response, 400, "Bad talk data");
            }

            //HANDLE REQUEST --title, and
            //register added talk through talks object
            else {
                //add talk nd register change
                talks[title] = {title: title,
                    presenter: talk.presenter,
                    summary: talk.summary,
                    comments: []};
                registerChange(title);
                respond(response, 204, null);
            }
        });
    });

//add comments
router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
    //get title
    function(request, response, title) {

        //use request information to get title of talk of comment.
        readStreamAsJSON(request, function(error, comment) {

            if (error) {
                respond(response, 400, error.toString());

//check if the the co
            } else if (!comment ||
                typeof comment.author != "string" ||
                typeof comment.message != "string") {
                respond(response, 400, "Bad comment data");
            }

            else if (title in talks) {
                //record the adding of comments
                talks[title].comments.push(comment);
                registerChange(title);

                respond(response, 204, null);
            }

            else {
                respond(response, 404, "No talk '" + title + "' found");
            }
        });
    });

//send JSON object containing talks and responses
function sendTalks(talks, response) {
    respondJSON(response, 200, {
        serverTime: Date.now(),
        talks: talks}
    );
}

router.add("GET", /^\/talks$/, function(request, response) {

    //CREATES A URL OBJECT THAT CONTAINS QUERY
    // OBJECT(WITH INFORMATOIN ABOUT corresponding FILe)
    // AS A PROPERTY.(due to the second argument(true) to parse().
    var query = require("url").parse(request.url, true).query;

    //if talk was not changed RETURN A LIST OF ALL TALKS
    if (query.changesSince == null) {
        //request was not changed.
        var list = [];

        //collect talks(objects)
        for (var title in talks)

            //record the content of the talks
            list.push(talks[title]);

        sendTalks(list, response);


        //if talk has been changed before, GET THE MODIFIED VERSION
    } else {

        //time since last change
        var lastTimeChanged = Number(query.changesSince);

        if (isNaN(lastTimeChanged)) {
            respond(response, 400, "Invalid parameter");

        } else {

            //get talks changed since last time (array)
            var lastTalkChanges = getChangedTalks(lastTimeChanged)

            //if there were any changes
            if (changed.length > 0)
                sendTalks(changed, response);

            //IF SERVER DOES NOT HAVE RESPONSE READY , WAIT.
            else
                waitForChanges(since, response);
        }
    }
});

//for each request, there will be a separate
// timer longpulling, basically waiting for an update and getting it when it is available
var waiting = [];

//stores a pending response, and responds when it has the file
function waitForChanges(since, response) {

    //store a time during which the waiting started.
    var waiter = {since: since, response: response};
    waiting.push(waiter);

    setTimeout(function() {

        var found = waiting.indexOf(waiter);
        if (found > -1) {
            waiting.splice(found, 1);
            sendTalks([], response);
        }
    }, 90 * 1000);
}

//array for storing changed talks\
//chnages will ahve talks in temporal order of which they were added and changed
var changes = [];

//I don't quite undersand how this works.
function registerChange(title) {

    //keep track of changed or added talks(title)
    changes.push({title: title, time: Date.now()});

    //send each talk that is waiting, and send them all based on the ones that were recently changed, time > since the waiter was changed.
    waiting.forEach(function(waiter) {
        sendTalks(getChangedTalks(waiter.since), waiter.response);
    });
    //empty out waiting requests array
    waiting = [];
}


.
//LOOKS THORUGH EACH CHANGE(changes ARRAY) AND RETURNS AND
function getChangedTalks(since) {

    //store the changed talks found
    var found = [];

    //closure for checking if a talk was already inspected
    function alreadySeen(title) {
        return found.some(function(f) {return f.title == title;});
    }

    //itearate through each change and create array of talks that
    //were have been changed since last register, were not already added,
    for (var i = changes.length - 1; i >= 0; i--) {

        //obtain changed talk
        var change = changes[i];

        //check if talk changed since last checking time
        if (change.time <= since)
            break;

        //check if the title was already inspected
        else if (alreadySeen(change.title))
            continue;

        //if the changed title is a new talk
        else if (change.title in talks)
            found.push(talks[change.title]);

        //if it's not int eh array, timely, was not already seen, then it must be
        //DELETED.
        else
            found.push({title: change.title, deleted: true});
    }

    return found;
}
