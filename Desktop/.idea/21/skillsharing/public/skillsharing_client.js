
1. CNA YOU TELL ME THE ROLE THAT URLS PLAY IN CLIENT-SERVE RRPOCESSES?
2. just what exactly does request({pathname do?????})????? is it just storing the request
2. oh yeah you wanted to say something about promises I forgot.... what is the power of it, what enables them to be so powerful?
3. is options basically the object that is sent to the resolve functoin
    4. explain the tactic of helping a server access specific values? do you just give it a name?
    5. request({pathname:.....}) does this create a request object thorugh the calling of htis function?
    SERVER SENDS BACK AN ERROR --> NETOWRK ERROR????????? ////HOW CAN YOU BE SO SURE?

    6. WHAT IS THE BODY OF THE REUQST FOR?????? WHERE SI IT ACCESSED BY THE SERVER?

//create http request



//OPTIONS - OBJECT REPRESENTING REQUEST (URL, BODY(CONTAINING METHOD), HANDLER) SENT TO THE ROUTER.


//submit a request giving description of the request in
//an object and handling response in a callback.
function request(options, callback) {
  var req = new XMLHttpRequest();

  //CREATES the asynchronous request object with corresopnding METHOD AND
  //the URUL YOU WANT TO SEND METHOD TO.
  req.open(options.method || "GET", options.pathname, true);

  //response was loaded
    //got response from server correctly
    //no response - request failed
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(null, req.responseText);

        //CLIENT'S FAULT - SERVER RESPONDED, CLIENT SENT BAD REQUEST
    else
      callback(new Error("Request failed: " + req.statusText));
  });

  //server returned an error
  req.addEventListener("error", function() {
    callback(new Error("Network error"));
  });

  //SENDS the METHOD TO THE SERVER IF THERE IS
  // ANY ADDITIONAL DATA TO BE PASSED INCLUDED
  // IN THE BODY. )
  req.send(options.body || null);
}

var lastServerTime = 0;



//
//        UI AND LONGPULLING AND RECORIDNG SERVERTIME OF LAST RESPONSE.

//displays the talks using talks property of response object,
// deals with error, and begins longpulling(waiting for changes)
request({pathname: "talks"}, function(error, response) {

  //if error exists
  if (error) {
    reportError(error);
  } else {

    //obtain name-value format of response's data to access the PROPERTIES (like tlaks)
    response = JSON.parse(response);

    //display talks Ui given infomrmatoin about the talks
    displayTalks(response.talks);

    //store server's time of response - USED FOR TRACKING TIMES OF RESPONSES(WHEN A TALK LAST CHANGED)
    // RETURNED FOR LIKE GET AND KN
    lastServerTime = response.serverTime;

    //LONGPULLS - stay updated on changes in talk(data) over a connection
    waitForChanges();
  }
});

//checks if there is an actual error and displays
function reportError(error) {

  if (error)
    alert(error.toString());
}

//div displaying talks
var talkDiv = document.querySelector("#talks");

// “associates talk titles with DOM nodes,”
var shownTalks = Object.create(null);


function displayTalks(talks) {

  //display all EXIsTING talks
  talks.forEach(function(talk) {

    //get DOM node of the talk
    var shown = shownTalks[talk.title];

    //check if talk is deleted and dispkay if needed.
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {

      //create new DOM STRUCTURE for the new talk
      var node = drawTalk(talk);

      //IF TALK IS SHOWN
      //shows ---> update the display(replsace shown node with new one)
      if (shown)
        talkDiv.replaceChild(node, shown);

      //iniitialize all existing nodes FIRST ROUND OF DISPLAYING
      else
        talkDiv.appendChild(node);

      shownTalks[talk.title] = node;
    }
  });
}

// “looks up elemente in thee template(#template) of a specific class (name)
// and fills in a template using EXISTING TEMPLATE with NODES THAT HAVE PLACEHOLDER VALUES.

// “The second argument to instantiateTemplate should be an object,
//     whose properties hold the strings that are to be filled into the
// template. A placeholder like {{title}} will be replaced with the value
// of values’ title property.”
function instantiateTemplate(name, values) {

  //closure - create a textnode given the name of the section in the template(author, message, etc)
  function instantiateText(text) {
    return text.replace(/\{\{(\w+)\}\}/g, function(_, name) {
      return values[name];
    });
  }

  //instantate a node in the already existing html
  // DOM structure nodes based on its type
  function instantiate(node) {

    //if chosen node is an element node, copy node and its child nodes(using recursive call to instantiate for each childnode[i])
    if (node.nodeType == document.ELEMENT_NODE) {
      var copy = node.cloneNode();
      for (var i = 0; i < node.childNodes.length; i++)
        copy.appendChild(instantiate(node.childNodes[i]));
      return copy;
    }

    //if node is text node, return a textnodes
    else if (node.nodeType == document.TEXT_NODE) {
      return document.createTextNode(
               instantiateText(node.nodeValue));
    }

    //what other kind of node could it be?
    else {
      return node;
    }
  }

  //Look up all nodes of a specific class in the template div and return a new copy of it and its chlidnodes.
  //return a (ID) #template (classname).name node according to its node type
  var template = document.querySelector("#template ." + name);
  return instantiate(template);
}

//set up the talk UI by instantiating each element in the template,
// using the existing HTML template,
// DOM structure of the class div "talk"
function drawTalk(talk) {

  //CREATE REPLICA(entire STRUCTURE, including child nodes) OF "TALK" CLASS DIV given
  // talk, a (talk <-> description of talk) associator
  var node = instantiateTemplate("talk", talk);

  //obtain all comments elements and create their DOM structure
  var comments = node.querySelector(".comments");
  //create template for all comments
  talk.comments.forEach(function(comment) {
    comments.appendChild(
      instantiateTemplate("comment", comment));
  });

  //give behavior to delete button
  node.querySelector("button.del").addEventListener(
    "click", deleteTalk.bind(null, talk.title));

  //give behavior to the talk div'sforms' submit buttons via the form itself
  var form = node.querySelector("form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    addComment(talk.title, form.elements.comment.value);
    form.reset();
  });

  return node;
}

//get the url for a talk given the title.
function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}

function deleteTalk(title) {
  request({pathname: talkURL(title), method: "DELETE"},
          reportError);
}

function addComment(title, comment) {
  var comment = {author: nameField.value, message: comment};
  request({pathname: talkURL(title) + "/comments",
           body: JSON.stringify(comment),
           method: "POST"},
          reportError);
}



//////STORING AND UPDATING THE NAMEFIELD////////

var nameField = document.querySelector("#name");

nameField.value = localStorage.getItem("name") || "";

//USING LOCALSTORAGE OBJECT

// The localStorage property allows you to access a local
// Storage object. localStorage is similar to sessionStorage.
//     The only difference is that, while data stored in localStorage
// has no expiration time, data stored in sessionStorage gets cleared
// when the browsing session ends—that is, when the browser is closed.

//USE LOCAL STORAGE TO STORE AND UPDATE NAMEFIELD.
nameField.addEventListener("change", function() {
  localStorage.setItem("name", nameField.value);
});

var talkForm = document.querySelector("#newtalk");

talkForm.addEventListener("submit", function(event) {
  event.preventDefault();
  request({pathname: talkURL(talkForm.elements.title.value),
           method: "PUT",
           body: JSON.stringify({
             presenter: nameField.value,
             summary: talkForm.elements.summary.value
           })}, reportError);
  talkForm.reset();
});

//gives APPLICATION LONGPULLING FUNCTIONALITY by waiting for changes intermittently and retrieving them when there is a change and
//recording the time of last change(on server aka serverTime) if there was.
// and if there was no change, waiting for changes.
function waitForChanges() {

  //request info about talks changed since the last time the server changed its data.
  //pass server informatoin about the last time it was updated, so GET can use it. t getChangedTalks(lastServerTime)
  request({pathname: "talks?changesSince=" + lastServerTime},
          function(error, response) {

   //if no changes available or error occured,
            // requesst again after some designated time, then poll for new data
    if (error) {

      //poll for data after a specific time to PREVENT LOSING CONNECTION DUE TO IDLENESS
      setTimeout(waitForChanges, 2500);
      console.error(error.stack);
    }

    // parse reponse to get talks object containig information abot the talks, display the talk,
    // and record server time and lONGPULL AGAIN by requesting for talks that changed since last servertime(the server's time of sending this current response)
    else {
      response = JSON.parse(response);

      //get talks that changed since last talk change
      displayTalks(response.talks);
      lastServerTime = response.serverTime;

      //LONG PULL AGAIN IMMEDIATELY
      waitForChanges();
    }
  });
}
