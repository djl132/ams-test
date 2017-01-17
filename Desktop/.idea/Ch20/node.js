/**
 * Created by DerekJLin on 10/22/16.
 */

var http = require("http");

http.createServer(function(request,response){

    response.writeHead(200,{"Content-Type": "text/html"});
    response.write("<h1> Hello! </h1>" +
        "<p>You asked for:" + "<code>" + request.url + "</code></p>");
    response.end()

});

server.listen(8000)


var http = require("http");
var request = http.request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
}, function(response) {
    console.log("Server responded with status code",
        response.statusCode);
});
request.end();



////////////////////////////
//////CREATE SERVER/////////
////////////////////////////

var http = require("http"), fs = require("fs");


////////LLOOK OVER THE CODE.


//OBJECT
// METHOD NAMES <--> METHOD IMPLEMENTATION
var methods = Object.create(null);

http.createServer(function(request, response) {

    // a callback functiom used to handle the data returned
    //if it has a content type (eliminates plain text)
    function respond(code, body, type) {

        //if text
        if (!type)
            type = "text/plain";

        //if element, write the header and convert to readable stuff
        response.writeHead(code, {"Content-Type": type});

        //make writable
        if (body && body.pipe)
            body.pipe(response);

        else
            response.end(body);
    }

    if (request.method in methods)
        methods[request.method](urlToPath(request.url),
            respond, request);

    else
        respond(405, "Method " + request.method +
            " not allowed.");


}).listen(8000);”



function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    return "." + decodeURIComponent(path);
}





methods.GET = function(path, respond) {

    //asynchronously get information from the file
    fs.stat(path, function(error, stats) {

        //check if existent

        // “When the file does not exist, fs.stat will pass an error object with a code property of "ENOENT" to its callback.”
        if (error && error.code == "ENOENT")
            respond(404, "File not found");

        else if (error)
            respond(500, error.toString());

        //if directory
        else if (stats.isDirectory())

            //read and return file list
            // files - the files in the list
            fs.readdir(path, function(error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, files.join("\n"));
            });

        // if regular file,
        //
        // return content of file
            //type of file is deteremined by MIME module.
        else
            respond(200, fs.createReadStream(path),
                require("mime").lookup(path));
    });
};

//DELETE...
methods.DELETE = function(path, respond) {
    fs.stat(path, function(error, stats) {

        //IF ALREADY REMOVED RETURN SUCCESS
        if (error && error.code == "ENOENT")
            respond(204);

        //IF ANYTHING ELSE
        else if (error)
            respond(500, error.toString());

            //CALLBACKS THAT HANDLE ERROR AND SUCCESS USING RESPOND.
        else if (stats.isDirectory())
            fs.rmdir(path, respondErrorOrNothing(respond));


        else
            fs.unlink(path, respondErrorOrNothing(respond));
    });
};

methods.PUT = function(path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function(error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function() {
        respond(204);
    });

    request.pipe(outStream);
};



////////////WE PUT ERROR HANDLING IN A SIMPLE FUNCTION BECAUSE WE RETURNED RETURNED VALUES OF THE ASYNCHRONOUS PROCESS USING PROMISES///////////


methods.GET = function(path) {

    //GET INFORMATION about the file of the path
    ///STATS STORES RESPONSE
    return inspectPath(path).then(function(stats) {

        if (!stats) // Does not exist
            return {code: 404, body: "File not found"};

        else if (stats.isDirectory())
            return fsp.readdir(path).then(function(files) {
                     return {code: 200, body: files.join("\n")};
            });
        else
            return {code: 200,
                type: require("mime").lookup(path),
                //allow the file to be readable
                body: fs.createReadStream(path)};
});
};


///HANDLE EXISTENCE
//CHECK EXISTENCE OF THE DATA REQUESTED
function inspectPath(path) {

    //return a promise that contains information about the file
    return fsp.stat(path).then(null, function(error) {

        //NONEXISTENT
        if (error.code == "ENOENT")
            return null;

        else
            throw error;
    });
}

methods.GET = function(path, respond) {

    //asynchronously get information from the file
    fs.stat(path, function(error, stats) {

        //check if existent

        // “When the file does not exist, fs.stat will pass an error object with a code property of "ENOENT" to its callback.”
        if (error && error.code == "ENOENT")
            respond(404, "File not found");

        else if (error)
            respond(500, error.toString());

        //if directory
        else if (stats.isDirectory())

        //read and return file list
        // files - the files in the list
            fs.readdir(path, function(error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, files.join("\n"));
            });

        // if regular file,
        //
        // return content of file
        //type of file is deteremined by MIME module.
        else
            respond(200, fs.createReadStream(path),
                require("mime").lookup(path));
    });
};









///////////////PUBLIC WEBSITE SPACE///////////////


function inspectPath(path){
    return fsp

}


















