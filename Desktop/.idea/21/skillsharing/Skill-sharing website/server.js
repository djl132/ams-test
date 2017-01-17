/**
 * Created by DerekJLin on 10/29/16.
 */

/////////SERVER CREATION
1. where is since coming from?
    1. the ALL GET method doesn't really return all of th tlaks, just the chnaged ones.  I'm confused.
    1. why would talks be nan?
    1. what exactly is a method url sutpposed to be used as what does it represent?
    2. why would a request send an error directly?
    5. is the url for GET there solely for verifying that it is a tlak tht hey want and the client tells
them the temporal condition of the get request?



var http = require("http");

var Router = require("./router");//////what does this line do?????????

var ecstatic = require("ecstatic");

var fileServer = ecstatic({root: "./public"});

var router = new Router();

//stores info about talks by title and each title
var talks = Object.create(null);

// “  talks[title] = {title: title,
//   presenter: talk.presenter,
//   summary: talk.summary,
//   comments: []};”


//create a server that accepts requests
http.createServer(function(request, response){

    //resolve the request sending it to an object interface
    if(!router.resolve(request,response))
        fileServer(request,response);/////what is this lien used fo?????

}).listen(8000);

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////HELPER METHODS FOR MAKING SENSE OF SENDING RESPONSE OF CLIENT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function respond (response, status, data, type){

    response.writeHead(status, {"Content-Type": type || "text/plain"});
    //SEND DATA TO CLIENT
    response.end(data);

}

function respondJSON(response, status, data){
    respond(response, status, JSON.stringify(data)), "application/json");
}

//send JSON object containing talks and responses
function sendTalks(talks, response) {
    respondJSON(response, 200, {
        serverTime: Date.now(),
        talks: talks}
    );
}


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///PARSING INFO AOBUT REQUESTS

//used for methods that modify the server to find like put and post.
// used to find out what kidn of infomration to PUT or POST
// and handle any client error due to either a direct send of an error or unparsable bad client data.
////////////////////////////////////////////////////////////////////////////////////////
function readStreamAsJSON(stream, callback){
    var data = "";

    //if request fails
    stream.on("error", function(error){
        callback(error);
    })

    stream.on("data", function(frame) {
        data += frame;
    }

    //parse request and handle it
   stream.on("end", function(){
        var result, error;

       //request might succeed, but might be data is bad and cannot be parsed\
       //TRY PARSING data into object to be used by methods that are sending data
       try{
           var result = JSON.parse(data);
       }

       catch(e){
           error = e;
       }

       callback(error, result);
    })
}


////////////////////////////////////////////////////////////////////////
///LONG PULLING FUNCTIONALITY/////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//stores all waitign responses
var waiting = [];

//where does waiting for changes, ever send information about the send talks???
function waitForChanges(since, response){

    //keep track of waiting requests
    var waiter  = {since: since, response: response};
    waiting.push(waiter);

    setTimeout(function(){

        var found = waiting.indexOf(waiter);
        if(found > -1){
            waiting.slice(found, 1);
            sendTalks([], response)
        }
    }, 90000);
    //check if something is
}

//how exactly does
function registerChange(title){

    //record changes to get changes later
    changes.push({title: title, time: Date.now()})

    waiting.forEach(function (waitingResp) {
        sendTalks(getChangedTalks(waiter.since), waiter.response);     ULTIMATE QUESTION: //HOW EXACTLY DOES THIS KEP EVERYTHING UP TO DATE???

            });

    //reset waiting.....after
    waiting = [];

}

//returns the changed talks recorded by registerChanges
function getChangedTalks(since){

    var found = [];

    function alreadySeen(title)
    return found.some(function(f) {return f.title == title;});

    for (var i = changes.length; i>= 0; i--){
        var change = changes[i];

        if(change.time <= since)
            break;

        //why would there be reduundancies?
        else if (alreadySeen(change.title))
            continue;

        //how is talks updated, then becuase I think we are only getting the talks that were change, what about the old ones?
        else if(change.title in talks)
            found.push(talks[change.title]);

        else
            found.push({title: change.title, deleted: true});
    }

    return found;
}




////////////////////////////////////////////////////////////////////////
///SERVER METHODS/////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

///HOW CAN WE BE SO SURE THAT THIS WILL BE THE PATH? WHY WILL IT BE /TITLE/COMMENTS IN THE URL OF THE CLIENT'S REQUEST?
router.add("POST", /^\/talks\/([^ \/]+)\/comments$/, function(request, response, title){ //get title

    //parse request for comment info
    readStreamAsJSON(request, function(error, comment) {

        if (error) {
            response(response, 400, error.toString());}

        else if (!comment || typeof comment.author != "string", typeof comment.message != "string"){
            respond(response, 400, "Bad comment data");}

        else if(title in talks){
            //updat title's comments
            talks[title].comment.push(comment);
            registerChange(title);
            repond(response, 204, null);}

         else
             respond(response, 404, "No talk '" + title + "' found");
    });
});


//GET ALL TALKS
//takes in request, handles it, and extracts the last time at which the file was changed using query obtained through url module's parse(true).
router.add("GET", /^\/talks$/, function(request, response){

    //does this look into all of the files and find form the last time?
    var query = require("url").parse(request.url).query

    if (query.changesSince == null){
        var list = [];

        for(var title in talks)
            list.push(talks[title]);

        //why not just send the talk object
        sendTalks(list, response);}

    else{
        var lastTimeChanged = Number(query.changesSince);

        //WHAT WOULD THIS MEAN?
        if (isNaN(lastTimeChanged))
            respond(response, 400, "invalid parameter, talk")
        else
            var lastChanges = getChangedTalks(lastTimeChanged);

            if(changed.length > 0)
                sendTalks(changed, response);

        else
            waitForChanges(since, response); ////SHOULDN'T THIS BE LASTTIMECHANGED? //where is since defined?

        }
    }
}):


router.add("PUT", /^\/talks\/([^\/]+)$/, function (request, response, title){

    //parse request for talk that is being added
    readStreamAsJSON(request, function(request, function(error, talk) {

        //handle error in client data(sent error, or bad data(could not be parsed))
        if (error)
            respond(reponse, 400, error.toString())

        //WHAT EXACTLY DOES THIS LINE TELL YOU????? how could  you possibly send empty data
        else if (!talk || typeof talk.presenter !-"string" || typeof talk.summary != "string"
    )
        respond(response, 400, "Bad Data");

    else
        {
            //update talks and register and getChanges about the change

            talks[title] = {title: title, presenter: talk.presenter, summary: talk.summary,}
            registerChange(title);
            respond(response, 204, null) //what kind of text are you sending?????? server isn't sending naythign... lols?
        }
    }
}



router.add("GET", /^\/talks\/([^\/]+)$/, function(request, response, title){

    if(title in talks)
        respondJSON(response, 200, talks[title]);
    else
        respond(response, 404, "No talk'" + title + "'found");
});

router.add("DELETE", /^\/talks\/([^\/]+)$/, function(request, response, title){
    if (title in talks){
        delete talks[title];
        registerChange(title); ///check this line out!!!!!!!!!!!!
    }

    //it's already deleted
    respond(reponse, 204, null);
});





