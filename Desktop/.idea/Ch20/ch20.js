/**
 * Created by DerekJLin on 10/23/16.
 */

////we are making an http request , use http request module

var http = require("http");

var fs = require("fs");

var Promise = require("promise");

//create an object that associates names with functions(values)
var methods = Object.create(null);


/////WHICH LINE SENDS OUT THE RESPONSE? THE FIRST LINE?

//creating a server that responds to requests

http.createServer(function(request, response) {

    //respond to the request and modify the response
    respondTo(request).then(

        //IF RESPONSE SUCCESSFUL
        function(data){
        ////WHAT DO THESE LINES DO?
        response.writeHead(data.code, {"Content-Type": data.type || "text/plain"});
        if(data.body && data.body.pipe)
            data.body.pipe(response);

        else
            response.end(data.body);},

        //IF RESPONSE ERRED
        function(error){
                response.writeHead(500);
                response.end(error.toString());

            ///WHAT DOES THIS LINE DO?
                console.log("Response failed:", error.stack)
    });
};


//use a name-function
// associator to process response to the request
function respondTo(request){
    //check if the requested method is supported


    ///IS THIS A PROPERTY OF REQUEST?
    if(request.method in methods)

        //why do they need request information.
        return methods[request.method](urlToPath(request.url), request)

    //not supported __> return promise with a unsupported message

    else
        return Promise.resolve{code: 405, body: "Method" + request.method + "not supported."}

}

/////HELP ME UNDERSTAND THIS CODE.
function urlToPath(url){

}


//create a promise-returning fs - module

//do this by denodeifying(wrapping a function so taht it returns a promise) each fs method
var fsp = {};
["stat","readdir","mkdir","rmdir","unlink"].forEach(function (method){

    //convert method implementation to return a promise
    fsp[method] = Promise.denodeify(fs[method]);
    }
)};



//////obtain a promise that contains information about the path adn
// return a promise that embodies the path accordingly
methods.GET = function(path){

    //inspect the file embodied by the promise
    //and return a promise accordingly
    return inspectPath(path).then(function(stats){

        //if the file does not exist
        if(!stats)
            //resolve promise to these values
            return {code: 404, body: "File not found"});


    //check what kind of file it is
    else if (stats.isDirectory())

            //get a promise with an array of files
            return fsp.readdir.then(function(arrayOfFiles) {
                return {code: 200, body: arrayOfFiles.join("\n")};
            });

        else
            //IS THIS LINE FOR LOOKING UP WHAT FILE TYPE IT IS?
            return {code:200, type: require("mime").lookup(path), body:fs.createReadStream(path)};



    };
}


//helper variable used for telling user idempotent
// information(repetitive information)
//204 - means no content to return, success(ie: file already exists) though.
var noContent = {code: 204}
function returnNoContent(){return noContent};



//HELPER FUNCTION
//check if the file exists
//return a promise that containss infromation about file
function inspectPath(path) {

    return fsp.stat(path).then(null, function (error) {
        if (error.code == "ENOENT")
            return null;
        else
            throw error;
    });
}

methods.MKCOL = function(path, request){
    return inspectPath(path).then(function(stats){

        //check if there isn't yet a file
        // with that path.
        if (!stats)
            return fsp.mkdir(path).then(returnNoContent)

        //if directory, do nothing,
        // directory has been created (success is returned)
        if(stats.isDirectory)
            return noContent;

            //if file exists already
        else
            return{code: 400, body: "File exists"}

    });
}

/////how is this implemented ? by itself, what abotu the
// succeess and failure parts? how is it implemented
methods.PUT = function(path, request){

    //DON'T USE INSPECT PATH. WHY NOT?
    return new Promise(function(success, failure){

        //why?
        var outStream = fs.createWriteStream(path);

        outStream.on("error", failure);
        //whqt does this line do?
        outStream.on("finish", success.bind(null,noContent));

        //channel to standard output....is this the smae
        // output channel as return?
        request.pipe(outStream);

    });
}

methods.DELETE = function(path){

    return inspectPath(path).then(function(stat){

        if(!stat)
            return noContent;
        else if (stat.isDirectory())
            return fsp.rmdir(path).then(returnNoContent);
        else
            return fsp.unlink(path).then(returnNoContent);


    })
}