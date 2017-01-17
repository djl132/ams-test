/**
 * Created by DerekJLin on 10/29/16.
 */

1.

///////////////
///////////////
a higher order function that sends the server a request and then handles server's response'
///////////////
//submit a request giving description of the request in
//an object and handling response in a callback.
function request(options, callback){


    ////does this create a request object thorugh the calling of htis function?
    var req = new XML HttpRequest();

    //send request
    req.open(options.method || "GET", options.pathname, true);

    req.addEventListener("load", function(){

        //REQUEST SUCCESSFUL
        if(req.status < 400)
            callback(null, req.responseText);

        //REQUEST FAILED --> AKA BAD REQUEST
        else
            callback(new Error("REQUEST FAILED:" + req.statusText());)

    });

    //SERVER SENDS BACK AN ERROR --> NETOWRK ERROR????????? ////HOW CAN YOU BE SO SURE?
    req.addEventListener("error", function(){
        callback(new Error("Network error"));
    });

}

//////THE EXECUTION OF ACTUALLY SENDING REQUEST TO SERVER AND HANDLING RESPONSEE
request({pathname: "talks"}, function(error, response){ // SPECIFIES CALLBACK
    if (error)
        reportError(error);

    //obtain name-value format of response's data to access the PROPERTIES (like talks and serverTime)
    response = JSON.parse(response);

    //display talks Ui given infomrmatoin about the talks
    displayTalks(response.talks);

    //store server time during response
    lastServerTime = response.serverTime;

    //LONGPULLS - stay updated on changes in talk(data) by repeatedly pulling for new data on server
    waitForChanges();
}
});


function reportError(error){


}

var talkDiv = document.querySelector("#talks");

// “associates  titles with DOM nodes,”
var shownTalks = Object.create(null);


//takes in the talks property of parsed response oject of the request method.
function displayTalks(talks) {

//go thorugh each titled talk adn obtain reference to node and append to talkdiv.
    talks.forEach(function (talk) {

        //obtain reference to talk
        var shown = shownTalks[talk.title];

        if (talk.deleted) {
            if (shown){
                talkDiv.removeChild(shown);
                delete shownTalks[talk.title];}
        }

        else {

            //FILL IN
            //get the root node for the talk Ui
            var node = drawTalk(talk);

            if (shown)
                talkDiv.replaceChild(node, shown);

            //1. see html: is the talk class in the template going to be appended to talks id div?

             else
                talkDiv.appendChild(node);

            //this line will keep track of shown talkas
            //WHY ARE WE STORING TALKS EVEN IF WE AREN'T SHOWING THEM??????
            shownTalks[talk.title] = node;

        }

    });
}

//actually gives values to placeholders for a given talk
    function drawTalk(talk){

        //get node structure of the class using the porperties
        var node = instantiateTemplate("talk", talk);

        var comments = node.querySelector(".comments")
        talk.comments.forEach(function(comment) {
             comments.appendChild(instantiateTemplate("comment", comment));
        });


        ///GIVE BEHVAIOR USING HELPING REQUEST METHODS
        node.querySelector("button.del").addEventListener("click",
            deleteTalk(null, talk.title));


        var form = node.querySelector("form");
        form.addEventListener("submit", function(event){
            event.preventDefault();
            addComment(talk.title), form.elements.comment.value);///access form's comment value
            form.reset();
        });

        return node;
    }

//store data on a local storage to
var nameField = document.querySeletor("#name");
nameField.value = localStorage.getItem("name") || "";
nameField.addEventListener("change", function(){
    localStorage.setItem("name", nameField.value);
});


var talkForm = document.querySelector("#newtalk");
talkForm.addEventListener("submit", function(event) {
    event.preventDefault();
    request({
            pathname: talkURL(talkForm.elements.title.value), method: "PUT",
            body: JSON.stringify({presenter: nameField.value, summary: talkForm.elements.summary.value})
        }, reportError);

    talkForm.reset();});


//creates the dom structure of a class in the template
// logic: recursively calling a closure(instantiate) to
// string together original
// class node and subsequent child nodes. For chld nodes that
    function instantiateTemplate(name, values){

        //use values object associator to re
        function instantiateText(text){
            return text.replace(/\{\{(\w+)\}\}/g, function(_, name)
                return values[name];

            )};

        //starting from the recursively string together
        function instantiate(node) {
            //copy the element node
            var copy = node.cloneNode();

            if (node.nodeType == document.ELEMENT_NODE) {
            //create each child node and its child nodes
            for (var i = 0; i < node.childNodes.length; i++)
                //recusrsively append child nodes forming an ultimate child node
                // that contains all of the nodes in teh class div, then append
                copy.appendChild(insantiate(node.childNodes[i]));
            return copy;
            }

            //if textnode, replace with coresponding string value of class
            // stored in the properties of one of the talks in talks ogject
            // of the response object.
            else if(node.nodeType == document.TEXT_NODE)
                return  document.createTextNode(instantiateText(node.nodeValue));

                //IN WHAT CHASE WOULD A NODE BE NIETHER  TEXT OR ELEMENT?
            else
                return node;

        }

        //access node of the class
        var template = document.querySelector("#template." + name);
        return instaniate(template);
    }




/////////////////////////////////////////////////////////////////////////////
////////////////////FUNCTIONS THAT SEND A REQUEST TO SERVER HELP///////////////////
////////////////////FUNCTIONS THAT SEND A REQUEST TO SERVER HELP///////////////////
/////////////////////////////////////////////////////////////////////////////
function deleteTalk(title){
    request({pathname:talkURL(title), method: "DELETE"}, reportError);
}

function addComment(title, comment) {
    var comment = {author: nameField.value, message: comment};
    request({pathname: talkURL(title), method: "POST", body: JSON.stringify(comment)}
        , reportError)
}

///creates URL for title to pass to server
function talkURL(title){
    return "talks/" + encodeURIComponent(title);
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////lONG PULLING FUNCTIONATLIY//////////////////
//////////////////////////////////////////////////////////////////////////////////////////
function waitForChanges(){

    //provide specification for client's handling error and response
    request({pathname: "talks?changesSince=" + lastServertime},
        function(error, response){

        if (error) {
            //if error wait and then pull again
            setTimeOut(waitForChanges, 2500);
            console.log(error.stack);
        }

    });


    // parse reponse to get talks object containig information abot the talks, display the talk,
    // and record server time and lONGPULL AGAIN by requesting for talks that changed since last
    // servertime(the server's time of sending this current response
    else{
        response = JSON.parse(response);
        displayTalks(response.talks);
        lastServerTime = response.serverTime;

        //coninue longpulling
        waitForChanges();
    }
}
