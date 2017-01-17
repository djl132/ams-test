/**
 * Created by DerekJLin on 10/27/16.
 */




//////// This isn't a stand-alone file, only a redefinition of a few
// fragments from skillsharing/skillsharing_server.js

    //import modules for writing files and reading files
var fs = require("fs");

//stores backup file used to continue seesion on webiste
var talks = loadTalks();


function loadTalks() {

    var result = Object.create(null), json;

    //TRY TO READ FILE AND RETURN AN OBJECT
    try {
        json = JSON.parse(fs.readFileSync("./talks.json", "utf8"));
    } catch (e) {
        json = {};
    }

    //BECAUSE JSON.parse RETURNS A PROTOTYPE-LINKED OBJECT AND WE USE "IN" LATER TO ITERATE THROUGH DIRECT PROPERTIES OF THE OBJECT, WE NEED TO
    //transfer to another prototypeless object for :in: to work in the original code
    for (var title in json)
        result[title] = json[title];

    return result;
}

//register changes register changes to a backup file
function registerChange(title) {
    changes.push({title: title, time: Date.now()});
    waiting.forEach(function(waiter) {
        sendTalks(getChangedTalks(waiter.since), waiter.response);
    });
    waiting = [];

    //create file with talks data
    fs.writeFile("./talks.json", JSON.stringify(talks));
}



////comment field resets

// This isn't a stand-alone file, only a redefinition of displayTalks
// from skillsharing/public/skillsharing_client.js


//update the ui of the talks
function displayTalks(talks) {

    talks.forEach(function(talk) {

        //see if the talk is shown
        var shown = shownTalks[talk.title];

        //if it was deleted update the changes UI and storage
        if (talk.deleted) {
            if (shown) {
                talkDiv.removeChild(shown);
                delete shownTalks[talk.title];
            }
        }

        //update new takl even if it has old
        else {

            //ceate new updated talk node
            var node = drawTalk(talk);

            if (shown) {

                //save new value of comments
                var textField = shown.querySelector("input");
                var value = textField.value;

                //update child
                talkDiv.replaceChild(node, shown);

                //create new comments
                var newTextField = node.querySelector("input");
                newTextField.value = value;

                //checks whether the current node's textfield is in focus
                var hasFocus = document.activeElement == textField;

                if (hasFocus)
                    newTextField.focus();
            }

            else {
                talkDiv.appendChild(node);
            }


            //initialize and update info on which arrays are shown
            shownTalks[talk.title] = node;
        }
    });
}




///CREATE CODE THAT FINDS INFORMATAIONFOR EACH ELEMENT QUICKLY BY STROING THE NAME OF TH  PEROPRETY OF TH TALKS PROPERTY IN A SPECIFIC TALK YOU
//WANT IN  PROPERTY OF THAT CLASS.

// Note that the first argument to instantiateTemplate was changed to
// be the template itself, not its name, to make testing easier.

function instantiateTemplate(template, values) {

    function instantiateText(text, values) {
        return text.replace(/\{\{(\w+)\}\}/g, function(_, name) {
            return values[name];
        });
    }

    //WHAT IS HAPPENING HERE?
    function attr(node, attrName) {

        ///IM A BIT OCNFUSED.
        return node.nodeType == document.ELEMENT_NODE &&
            node.getAttribute(attrName);
    }

    function instantiate(node, values) {
        if (node.nodeType == document.ELEMENT_NODE) {
            var copy = node.cloneNode();
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];

                var when = attr(child, "template-when");
                var unless = attr(child, "template-unless");

                if (when && !values[when] || unless && values[unless])
                    continue;

                var repeat = attr(child, "template-repeat");

                if (repeat)
                    (values[repeat] || []).forEach(function(element) {
                        copy.appendChild(instantiate(child, element));
                    });
                else
                    copy.appendChild(instantiate(child, values));
            }
            return copy;
        }

        else if (node.nodeType == document.TEXT_NODE) {
            return document.createTextNode(instantiateText(node.nodeValue, values));
        }
    }

    return instantiate(template, values);
}

// A simple test function to verify that the above actually works

function test(template, values, expected) {
    var testTemplate = document.createElement("div");
    testTemplate.innerHTML = template;
    var result = instantiateTemplate(testTemplate, values).innerHTML;
    if (result != expected)
        console.log("Unexpected instantiation. Expected\n  " + expected + "\ngot\n  " + result);
}

test('<h1 template-when="header">{{header}}</h1>',
    {header: "One"},
    '<h1 template-when="header">One</h1>');

test('<h1 template-when="header">{{header}}</h1>',
    {header: false},
    '');

test('<p><img src="icon.png" template-unless="noicon">Hello</p>',
    {noicon: true},
    '<p>Hello</p>');

test('<ol><li template-repeat="items">{{name}}: {{score}}</li></ol>',
    {items: [{name: "Alice", score: "10"}, {name: "Bob", score: "7"}]},
    '<ol><li template-repeat="items">Alice: 10</li><li template-repeat="items">Bob: 7</li></ol>');

