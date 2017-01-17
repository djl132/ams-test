/**
 * Created by DerekJLin on 10/20/16.
 */



IN ORDER TO AVOID MAKING THE SET UP OF THE DOM STRUCTURE VER LONG AND TEDIOUS WITH A LOT OF QUERY SELECTORS AND DOCUMENT CREATIONS
WE ABSTRACT OVER THE SOLUTION IN  A HELPER FUNCTION THAT :
1. NAMES THE DOM Element
2.GIVES IT ITS ATTRIBUTES

function elt(name, attributes) { ///IS THIS TAKEN IN AS THE ATTRIUBTES
    var node = document.createElement(name);

    if (attributes) {

        for (var attr in attributes)
            if (attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
    }

    //APPEND CHILD NODES
    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")

            //CREATE TEXT NODE
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}


///sets up the interface for
var controls = Object.create(null);

function createPaint(parent) {
    var canvas = elt("canvas", {width: 500, height: 300});
    var cx = canvas.getContext("2d");

    //toolbar wiht controls
    var toolbar = elt("div", {class: "toolbar"});

    for (var name in controls)
        toolbar.appendChild(controls[name](cx));

    //the drawing box
    var panel = elt("div", {class: "picturepanel"}, canvas);

    “wrap the canvas and the controls in <div> elements with
        classes so we can add some styling, such as a gray border around the picture.”

    parent.appendChild(elt("div", null, panel, toolbar));
}

“The tool field is populated with <option> elements for all tools that have been defined, and a
"mousedown" handler on the canvas element takes care of calling the function for the current tool,
    passing it both the event object and the drawing context as arguments.”




var tools = Object.create(null);


//creates a tool bar for selecting which tool to use
//1. sets up the select and options
//2. mousedown event.

controls.tool = function(cx) {

    var select = elt("select");

    //set up the tools option menu
    //add the tool's as an option
    for (var name in tools)
        select.appendChild(elt("option", null, name));


    //add listeners to canvas for tool actions
    cx.canvas.addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            tools[select.value](event, cx);
            event.preventDefault();
        }
    });

    return elt("span", null, "Tool: ", select);
};


//////what is this doi
“function relativePos(event, element) {
    var rect = element.getBoundingClientRect();
    return {x: Math.floor(event.clientX - rect.left),
        y: Math.floor(event.clientY - rect.top)};
}”

//add event listeners onmove and remove them onEnd of drag.(releas)


///object interface that hold paint methods
//used by the control's tool functoin used to create a control.


////is this right????


///////MOVE TO OLD POSITION CALCULATE AN DSTORE NEW POSITION AND THEN DRAW TO NEW POSITION.
“var tools = Object.create(null);

“tools.Line = function(event, cx, onEnd) {
    cx.lineCap = "round";

    //get intial pos.
    var pos = relativePos(event, cx.canvas);


    ///HOW DOES THIS WORK????
    trackDrag(function(event) {

        cx.beginPath();

        //START FORM LA ST POSITION
        cx.moveTo(pos.x, pos.y);


        //SAVE FUNINSING POSITION FOR NEXT DRAW
        pos = relativePos(event, cx.canvas);

        //DRAW THE LINE
        cx.lineTo(pos.x, pos.y);

        cx.stroke();
    }, onEnd);”
    “
    removeEventListener("mouseup", end);
    if (onEnd)
        onEnd(event);
}
addEventListener("mousemove", onMove);
addEventListener("mouseup", end);
}


This function takes two arguments. One is a function to call for each "mousemove" event, and the other is a function to call when the mouse button is released. Either argument can be omitted when it is not needed.
    The line tool uses these two helpers to do the actual drawing.


    //create the line function
    //takes in information about an event and then the canvas, and the onEnd event.
    //specifies the


    ////WHERE DOES IT SAVE THE PREVIOSU POSITION OF THE MOUSE?
    tools.Line = function(event, cx, onEnd) {

    cx.lineCap = "round";

    //find relative position at which the event happened on the canvas
    var pos = relativePos(event, cx.canvas);

    //draw from start to end
    trackDrag(function(event) {
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
        pos = relativePos(event, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
    }, onEnd);
};

controls.color = function(cx) {
    var input = elt("input", {type: "color"});
    input.addEventListener("change", function() {
        cx.fillStyle = input.value;
        cx.strokeStyle = input.value;
    });
    return elt("span", null, "Color: ", input);
};






controls.openFile = function(cx) {

    var input = elt("input", {type: "file"});

    //upon upload
    //loadimage and read the url
    input.addEventListener("change", function() {

        if (input.files.length == 0) return;
        var reader = new FileReader();

        //load the image
        reader.addEventListener("load", function() {
            loadImageURL(cx, reader.result);
        });

        //read the data and get the dataURL
        reader.readAsDataURL(input.files[0]);
    });

    return elt("div", null, "Open file: ", input);
};



tools.Spray = function(event, cx) {

    //radius of the spray
    var radius = cx.lineWidth / 2;

    var area = radius * radius * Math.PI;

    //calculate how many ticks you want
    var dotsPerTick = Math.ceil(area / 30);

    var currentPos = relativePos(event, cx.canvas);

    //draw the dots every 25 milliseconds
    var spray = setInterval(function() {

        //draw spray's dots
        for (var i = 0; i < dotsPerTick; i++) {

            var offset = randomPointInRadius(radius);

            cx.fillRect(currentPos.x + offset.x, currentPos.y + offset.y, 1, 1);
        }

    }, 25);

    //listen and move current position
    trackDrag(function(event) {
        currentPos = relativePos(event, cx);

    }, function() {

        //clear the interval
        clearInterval(spray);
    });


};
