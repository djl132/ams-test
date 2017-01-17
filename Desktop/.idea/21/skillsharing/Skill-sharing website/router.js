/**
 * Created by DerekJLin on 10/29/16.
 */

var Router = module.exports = function(){
    this.routes = [];
}

//adds server handling for client request methods
Router.prototype.add = function(method, url, handler){
    this.routes.push({method: method, url: url, handler: handler});

}

//abstractly helps a server handle a method request,
// leaving specificaiton to each handler's specifcations
Router.prototype.resolve = function(request, response){


    var path = require("url").parse(request.url).pathname;

    return this.routes.some(function(route){

        //get path in url-form
        var match = route.url.exec(path);

        if (!match || request.method != route.method)
            return false;

        else {
            var urlParts = match.slice(1).map(deodeURIComponent);

            //CHANGE EXECUTION CONTEXT FROM ROUTER TO STUFF.
            route.handler.apply(null, [request,response].concat(urlParts));
            return true;
        }
    })


}



