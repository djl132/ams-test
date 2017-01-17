EM

QUESTION:

4. waht exactly is module.exports??? are we simply making the interface's functions accessible to all' +
' code in the same directory location? if they create teh object, they are basically allowed to create the object interface? ' +
'what makes this an interface?
5. waht exacty does it mean to resolve evnets? because
    i see here that it takes both request and response.
    6. is array.porotype.some used to search for and implement the corresponding handler? does it also return true?
    when is this kind of logic usually used?
3. Question: WHEN DOES THE RESPONSE TAKE ON A VALUE??? what middleware handles it ? does ECSTATic Do it?
4. for route.handler.apply's arguments why not just use .call()????' +
'' +
'1. how exactly is this an example of a good interface? what makes something a good interface?'
2. HOW DO I GET THIS THING RUNNING IN REAL LIFE? teach me how to set up the actual server, does it actually involve terminal?


///////ROUTER IS THE OBJECT INTERFACE (COLLECTION OF HIGHER-ORDER METHODS) THAT THE SERVER USES TO store and handle ways(routes) of exchanging information between a server and a client
// requests
// the server SIMPLY PASSes IN REQUESTS and the interface calls a method THE SPEICIIFDAIOTN OF WHICH IS SPECIFID BY THE SERVER SIDE CODE.

//add methods to interface

//CREATE SERVER SIDE METHODS AND STORE THEM INTO AN ARRAY THAT CONTAINS OBJECTS WITH METHODS AND
Router.prototype.add = function(method, url, handler) {
  this.routes.push({method: method,
                    url: url, //useful info used in handler: use REGULAR EXPRESSION ot extract section of useful data in the path url passed into the method.
                    handler: handler});//handler that
};





//TAKES IN A METHOD REQUEST AND RESPONDS BY HANDLING THE REQUEST
// USING THE CORRESPONDING METHOD SUPPORTED BY THE SERVER/ROUTER INTERFACE.
//LOGIC:

    //1. returns boolean value indicating that
    // whether or not the request was resolved
    //2. extracts useful information from the request object(aka options)
Router.prototype.resolve = function(request, response) {

    //get pathname of url
  var path = require("url").parse(request.url).pathname;

    
    //return response to the method request that matches one of the server methods
  return this.routes.some(function(route) {

    //extract useful part of the pathname of the file(path) that matches
      // the regular expression of the method. first array element is sliced off(subgroup is obtained)
    var match = route.url.exec(path);

    //NO
    //methods are supported and request contains required information by route(process of sending server data to client)
    if (!match || route.method != request.method)
      return false;

    //YES

    //if TITLE needed, decode info(match),
      // convert to array and get rid of entire matchign segment(slice)
      // (for adding to handler arguments,
      // title if needed)
      //or else get rid of info(info)
    var urlParts = match.slice(1).map(decodeURIComponent);



      //during the handler. middleware(takes in request and response) does it. it's behind the scenes.

      route.handler.apply(null, [request, response].concat(urlParts));
    return true;
  });

};









