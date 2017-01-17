/**
 * Created by DerekJLin on 10/22/16.
 */






//CONTENT NEGOTIAION
//
Questios:
    1. why check for the first request and then subsequent ones? Is data received in bursts?
// “Do this again, using Node’s http.request function. Ask for at
// least the media types text/plain, text/html, and application/json. Remember
// that headers to a request can be given as an object, in the headers property of
// http.request’s first argument.
//     Write out the content of the responses to each request.”

//import HTTP MODULE
var http = require("http");

["text/plain", "text/html", "application/json"].forEach(function(type) {

//function for requesting a file in a specific format(type)


//request and response handler
    http.request(
        hostname : "eloquentjavascript.net",
        path:"/author",
        method:"GET",
        headers:{ Accept: type} ,

//HANDLE RESPONSE
    function (response) {

//check for any errors

        ////WHICH ONE DOES THIS ONE CHECK???????????????
        if (response.statusCode != 200) {
            console.error("Request for:" + type + "failed:" + response.statusMessage);
            return;
        }

//take in response and handle it acccordingly
        readStreamAsString(response, function(error, content) {
//check if there is any error
            if (error)
                throw error;
            console.log("Type " + type + ":" + content);
        });

    }).end();
});

//
// LOGIC: READ DATA AS STRING
//     1. ERROR IN DATA RECIEVING
//     2. STORE ALL DATA AS YOU READ THROUGH ALL OF THE DATA
//     // 3.   end of reading, return all data.

function readStreamAsString(response, handle) {

//string for outpue
var content= "";

response.on("error", function (error){
    handle (error);
});

//adding data bit by bit



    ////HOW DOES THIS WORK????????????
response.on("data", function(data){
    content += data;
});

//when done reading response return content as string
response.on("end", functin(){
    handle(null, content)
    });
}


///////WHY DO WE HAVE TO MAKE THESE CHECKS?
/////MKCOL///////


////makes a directory/file and handles the
// creation process accordingingly
methods.MKCOL = function(path, respond) {

    //get information about the file(if it already exists and what not)
    fs.stat(path, function(error, content) {

        //if the directory does not yet exist
        if (error && error.code == "ENOENT")
            fs.mkdir(path, respondErrorOrNothing(respond));

        //some server error
        else if (error)
            respond(500, error.toString());

            //the directory or file already exists
        else if (content.isDirectory())
            respond(204);

            //path is that of an existing file : bad input/request .
        else
            respond(400, "File exists");
    });
};



///HOW DOES THI FIX LEAKS WHAT IS PARSE???? URL DOING?
/////////fixing leaks///////////////////////
function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    var decoded = decodeURIComponent(path);

    //prevent people from accessing parent informaotin from the current directory relatively.
    return "." + decoded.replace(/(\/|\\)\.\.(\/|\\|$)/g, "/");
}



///////////////////////////////////////////
////////////////PUBLIC SPACE///////////////
///////////////////////////////////////////


var http = require("http")
var fs = require("fs");
var Promise = require("promise");

var methods = Object.create(null);

// Remember that promises can either fail or succeed. The `then`
// method takes two callbacks, one to handle success and one to handle
// failure. The strategy for dealing with exceptions and other failure
// is to notice them in the second callback passed here, and return a
// 500 response.
//
// On success, the promise returned by respondTo should return an
// object with a `code` property indicating the response code, and
// optional `body` and `type` properties. The body can be a stream to
// directly pipe into the response, or a string.


http.createServer(function(request, response) {
    respondTo(request).then(function(data) {
        response.writeHead(data.code, {"Content-Type": data.type || "text/plain"});
        if (data.body && data.body.pipe)
            data.body.pipe(response);
        else
            response.end(data.body);
    }, function(error) {
        response.writeHead(500);

        //print out the error
        response.end(error.toString());
        console.log("Response failed: ", error.stack);
    });
}).listen(8000);

function respondTo(request) {
    if (request.method in methods)
        return methods[request.method](urlToPath(request.url), request);
    else
        return Promise.resolve({code: 405,
            body: "Method " + request.method + " not allowed."});
}



function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    var decoded = decodeURIComponent(path);
    return "." + decoded.replace(/(\/|\\)\.\.(\/|\\|$)/g, "/");
}

// Wrap the fs functions that we need with Promise.denodeify, so that
// they return promises instead of directly taking a callback and
// passing it an error argument.

var fsp = {};
["stat", "readdir", "rmdir", "unlink", "mkdir"].forEach(function(method) {
    fsp[method] = Promise.denodeify(fs[method]);
});

// Since several functions need to call `fsp.stat` and handle failures
// that indicate non-existent files in a special way, this is a
// convenience wrapper that converts file-not-found failures into
// success with a null value.
//
// Remember that calling the `then` method returns *another* promise,
// and that having a failure handler return normally replaces the
// failure a success (using the returned value). We're passing null
// for the success handler here (letting through normall successes
// unchanged), and changing one kind of failure into success.

                                           /
    /////CHECKS IF THE PATH IS VALID, ERROR OR ENOENT?
function inspectPath(path) {
    return fsp.stat(path).then(null, function(error) {

        if (error.code == "ENOENT")
            return null;
        else
            throw error;
    });
}

// We can get by with much less explicit error handling, now that
// failures automatically propagate back. The new promise returned by
// `then`, as returned from this function, will use one of the values
// returned here (objects with `code` properties) as its value. When a
// handler passed to `then` returns another promise (as in the case
// when the path refers to a directory), that promise will be
// connected to the promise returned by `then`, determining when and how
// it is resolved.

methods.GET = function(path) {
    return inspectPath(path).then(function(stats) {
        if (!stats) // Does not exist
            return {code: 404, body: "File not found"};
        else if (stat   s.isDirectory())
            return fsp.readdir(path).then(function(files) {
                return {code: 200, body: files.join("\n")};
            });
        else
            return {code: 200,
                type: require("mime").lookup(path),
                body: fs.createReadStream(path)};
    });
};

var noContent = {code: 204};
function returnNoContent() { return noContent; }

// Though failure is propagated automatically, we still have to
// arrange for `noContent` to be returned when an action finishes,
// which is the role of `returnNoContent` success handler.

methods.DELETE = function(path) {
    return inspectPath(path).then(function(stats) {
        if (!stats)
            return noContent;
        else if (stats.isDirectory())
            return fsp.rmdir(path).then(returnNoContent);
        else
            return fsp.unlink(path).then(returnNoContent);
    });
};

// To wrap a stream, we have to define our own promise, since
// Promise.denodeify can only wrap simple functions.

///WHAT ABOUT DATA PUSHES? ABOVE!!!! FIRST EXAMPLE?
methods.PUT = function(path, request) {
    return new Promise(function(success, failure) {
        //reate
        var outStream = fs.createWriteStream(path);
        outStream.on("error", failure);
            outStream.on("finish", success.bind(null, noContent));

        //what does this line do?
        request.pipe(outStream);
    });
};

methods.MKCOL = function(path, request) {
    return inspectPath(path).then(function(stats) {
        if (!stats)
            return fsp.mkdir(path).then(returnNoContent);
        if (stats.isDirectory())
            return noContent;
        else
            return {code: 400, body: "File exists"};
    });
};




