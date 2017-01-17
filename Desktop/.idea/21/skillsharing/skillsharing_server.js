

anwered QUYESTSION:

 11: WAT IS THIS?????ARE WE IMPORTING THE ROUTER INTERFACE/MODULE?????

    10.GO THROUGH LOGIC OF GETCHNAGED, WAITINGCHANGES,AND REGISTERCHANGES.(i'll work this out')
Why are they designed the way they are designed? How do they work together? I cna't visuallize it. '

9. DOES THE SERVER HAVE ANY IMPLEMENTATION THAT CAUSES THESERVER TO NOT SEND ANY
INFORMATION UNTIL IT KNOWS THAT ALL OF IT IS UPDATED TO REAL-TIME? EX: CLIENT GET requests talks, but talks si not yet updated,
    since there is a method in the queu that is waiting for changes about the title of a speciic talk?

11. losl I still don't get query properites vs. url params....?'

query sotres informatino about behavior

param stores properties passed to server by the client

13. where does changed come form in GET All???
    5. WHY IS LASTTIMECHANGED NAN POSSBILY?

    7. WHER DOES since COME FROM FOR waitingForChanges() (SERVER)?


    questions!!!!!
    6. WHY DOES GETTING A SPECIFIC TITLE REQUIRE STRINGIFYING TALKCONTENT(TALK[TITLE])? AND THEN WHEN THE CLIENT GETS IT,
    8. WHY DOES IT AGAIN PARSE THE RESPONSE.
    // it needs it in json format since the client is not specified to tell itself
// that it will recieve json informatoin.



//////THIS CODE RESPONDS DIRECTLY TO METHOD REQUESTS AND FILE REQUESTS USING THE HTTP MODULE TO CREATE A SERVER.
//ADDS SERVER MTHODS AND ASSISTING HELPER FUNCTIONS.


///LOGIC:
//    SERVER USES AN OBJECT INTERFACE(router object) TO HANDLE REQUESTS.

var http = require("http");

//WAT IS THIS?????ARE WE IMPORTING THE ROUTER INTERFACE/MODULE?????
var Router = require("./router");

var ecstatic = require("ecstatic");


// “root option to tell the server where it should look for files. ”
var fileServer = ecstatic({root: "./public"});

//object interface that provides INTERFACE
// FOR HANDLING METHOD REQUESTS FROM CLIENT.
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


//JUST SEND RAW DATA
function respond(response, status, data, type) {

  response.writeHead(status, {
    "Content-Type": type || "text/plain"});
  ///WHEN RESPONSE IS READY.

  response.end(data);
}

//SEND PARSED DATA JSON FORMAT
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


//USE RESPONDJSON BECAUSE NEED TO GET STUFF INTO STRING FORM.
router.add("GET", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  if (title in talks)
    respondJSON(response, 200, talks[title]);

      //BAD REQUEST
  else
    respond(response, 404, "No talk '" + title + "' found");
});


//no data to read and handle --> no need for ReadStreamASJSON
router.add("DELETE", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  if (title in talks) {
    delete talks[title];
    //update clients on the change
    registerChange(title);
  }
  respond(response, 204, null);
});


//USED FOR METHODS TO GET DATA.
//parses data from the response
// and handles it(callback)
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


    //MATCHES THE CORRECT METHOD , AND OBTAINS REQUIRED INFORMATOIN
           function(request, response, title) {

             //PARSES REQUEST INFORMATIN
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


//PARSES AND GETS QUESRY'S TIME, NO NEED FOR JSON, IT SIMPLY NEEDS THE QUERY
// OBJECT THAT HAS THE TIME OF LAST CHANGE TO UPDATE TALKS AND RETRIEVE THEM.
router.add("GET", /^\/talks$/, function(request, response) {

  //CREATES A URL OBJECT THAT CONTAINS QUERY
  // OBJECT(WITH INFORMATOIN ABOUT corresponding FILe)
  // AS A PROPERTY.(due to the second argument(true) to parse().
  //USES IT TO obtain th last time the file was changed and get the changed talks updating
  // it and then passing all of the  talks in their state, even the unchanged ones.
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

    //GET LASTTIMECHANGED
    var lastTimeChanged = Number(query.changesSince);

    ////were any tlkas chnaged since?
    if (isNaN(lastTimeChanged)) {
      respond(response, 400, "Invalid parameter");

    }

    //IF ANY TLKAS HAVE BEEN CHANGED
    else {

      //UPDATE CHANGES
      var lastTalkChanges = getChangedTalks(lastTimeChanged)

      //RETURN ALL CHANGED TALKS
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


//array for storing changed talks
var changes = [];

//register adds and changes
function registerChange(title) {

  //keep track of changed or added talks(title)
  changes.push({title: title, time: Date.now()});

  //send each talk that is waiting
  waiting.forEach(function(waiter) {
    sendTalks(getChangedTalks(waiter.since), waiter.response);
  });
  //empty out waiting requests array
  waiting = [];
}


//given a time, return an array of talks
// that have changed since that time
function getChangedTalks(since) {

  //store the changed talks found
  var found = [];

  //PREVENTS SENDING TALKS REDUNDANTLY

  //closure for checking if a talk was already inspected by checking an
  // array contianing found tlkas already
  function alreadySeen(title) {
    return found.some(function(f) {return f.title == title;});
  }

  //itearate through each change and create array of talks that
  //were have been changed since last register, were not already added,
  for (var i = changes.length - 1; i >= 0; i--) {

    //obtain changed talk
    var change = changes[i];

    //check if talk changed since last checking time
    //stop checking because then he previous talks were even not changed either because changes go from right to left
    if (change.time <= since)
      break;

    //check if the title was already inspected
        //push talk to found array
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
