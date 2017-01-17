


///CREATE A FUNCTION ELT THAT ALLOWS YOU TO CREATE AN ELEMENT WITH
//A CLASSNAME AND ATTRIBUTES, AND APPEND NODES


////////////////////////////////////
///////HELPER FUNCTIONS/////////
////////////////////////////////////

//return an object that represents the relative position of an event in the canvas.
//context allows you to access the canvas.
function relativePos(event,cx){
  var offset = cx.getBoundingClientRect();

  return
  {x: Math.floor(event.clientX - offset.x),
      y: Math.floor}
}

////HELPER FUNCTION FOR CREATING ELENENTS AND EDITING THEIR APPEARANCE AND CONTENT
name ---> class name
  attributes ----> object containing the value of properties of elements
    childNodes ----> additional arguments

function elt(name, attributes){

  var node = document.createElement(name);

  if(attributes){
    for (var attr in attribute)

      //what is this checking?
      if(attributes.hasOwnProperty(attr))
        node.setAttribute(attr, attributes[attr]);
  }

  //iterate through each child node
  for(var i = 2: i < arguments.length; i++)
  {
    var childNode = arguments[i];

    //turn into textnode if text and not an element node
    if (typeof childNode == "string")
      childNode = document.createTextNode(childNode);

    node.appendChild(childNode)
  }

  return node;

}

//create a function taht specifies a drag and release handler function(if there is one)
 function trackDrag(onMove, onEnd){

   function end(event){
     removeEventListener("mousedown", onMove);
     removeEventListener("mouseup", end);

     if(onEnd)
       onEnd(event);
   }

   addEventListener("mousedrag", onMove);
   addEventListener("mouseup", end)
 }


 //load image of a url to the canvas
function loadImageURL(cx, url){
  //create the image of the url
  var image = elt("img");
  image.src = url;

  //when image is loaded, display the image
  image.addEventListener("load", function(){

    ///when you resize the canvas, the context forgets configuration
    // properties like fillstyle and linewidth.
    var color = cx.fillStyle;
    var size = cx.lineWidth;
    cx.canvas.width = image.width;
    cx.canvas.height - image.height;

    //load the image to the canvas and restore configuration properties of the context
    cx.drawImage(image, 0, 0);
    cx.fillStyle = color;
    cx.lineWidth = size;

  });
}


///////////////////////////////////////////////////////////////
/////////////////////SET UP UI/////////////////////////////////
///////////////////////////////////////////////////////////////

function setUpUI(parent){

  //set up the canvas and context for interacting with that canvas
  var canvas = elt(canvas, {width: 500, height: 300});
  var cx = canvas.getContext("2d");a

  //create the panel (div) which contains the canvas
  var panel = elt(div, {class:"picturepanel"}, canvas);

  //create the toolbar with controls using a controls
  // object(with functions that create elements of for each component of the toolbar
  var toolbar = elt("div", {class:"toolbar"});

  for (var name in controls){

    //create and append control interface with their respective
    // listeners to the toolbar div
    //pass in the context to give the controls access to the canvas
    toolbar.appendChild(controls[name](cx))
  }
  //append the panel and toolbar to the parent node
  parent.appendChild(elt("div", null, panel, toolbar));

  //parent.appendChild(panel, toolbar);
}




///////////////////////////////////////////////////////////////
/////////////////////SET UP CONTROLS/////////////////////////////////
///////////////////////////////////////////////////////////////

/////Now, we need to initiate the UI of the paint program.
1. create a function that sets up the UI and appends that ui to a parent node(probably document.body node)
2. be able to create a paint program using an object constructor
3. set up the canvas


var controls = Object.create(null);


//set up the tools selector and add its options and add event listener taht listens to mousedown adn calls a
// functoin that changes how the canvas interface works.
controls.tools = function(cx){
  var selector = elt("select",null)

  for(var mode in tools)

  //create option with the name of each mode(mode)
    selector.appendChild(elt("option", null, mode));

  //initialize each mode of editting(text, line, spray)
  //based on which option is selected and when canvas is clicked
  cx.canvas.addEventListener("mousedown", function(event,cx){
    if (event.which == 1)
      tools[select.value](event,cx.canvas);
      event.preventDefault());
  }
});

//create a color changer for canvas
//create event listener that listens to changes in color(input.value)
controls.color = function(cx){
  //create the input color element
  var input = elt("input", {type: "color"})

  //change the color of the canvas by adding an event (color) listener to the input colors element
  input.addEventListener("change", function(){
    cx.fillStyle = input.value;
    cx.strokeStyle = input.value;
  });

  return elt("span", null, "Color:", input)
}


///save an canvas content into a DATA URL containing the content(img) itself.
controls.save = function(cx){

  //create link
  //WHAT DOES THIS "/" MEAN?
  var link = elt("a", {href: "/", "Save"});

  //try to convert canvas image to dataLinkURL that contains the image itself, instead of referencing it. and let that only happen when it is mousedover.
  //might fail because file is tainted due to restricted access(catch the Security Error)

  function update() {
    try {
      link.href = cx.canvas.toDataURL();
    }
    catch (e) {

      if (e instanceof SecurityError)
        link.href = "javascript: alert(" + JSON.stringify("Can't save: " + e.toString()) + ")";
      throw e;
    }
  }

  link.addEventListener("mouseover", update());
  link.addEventListener("focus", update());
  return link;

}


//OPEN THE FILE USING URL AND EXTRAC THE DATAURL OF THE FILE
////////HELP ME UNDERSTNAD HTIS......LOOK HIS OVER
controls.openFile = function(cx) {

  var input = elt("input", {type: "file"});

  //upon upload
  //loadimage and read the url
  input.addEventListener("change", function() {


    //WHAT DOES THIS LINE DO?
    if (input.files.length == 0) return;


    var reader = new FileReader();

    //load the image
    reader.addEventListener("load", function() {
      loadImageURL(cx, reader.result);
    });


    /////WHAT DOES THIS LINE DO?
    //read the data and get the dataURL
    reader.readAsDataURL(input.files[0]);
  });

  return elt("div", null, "Open file: ", input);
};




////////////////////////////////////////////////////////////////////////////////////////////
/////////////CREATE THE TOOLS SELECTOR AND ITS IMPLEMENTATION/////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//create object constructor for crating the tools for the toolbar.
var tools = Object.create(null);

//a function taht draws a line and does something else when done(onEnd)
// as clean up code, which is later used by ERASE.
tools.Line = function(event, cx, onEnd) {

  cx.lineCap = "round";

  //get initial position
  var initPos = relativePos(event, cx.canvas);

  //drag handler
  trackDrag(function (event) {
    cx.beginPath();

    //CONTEXT OBJECT OF CANVAS MOVES PEN TO STARTING POSITION WITHOUT DRAWING
    cx.moveTo(initPos.x, initPos.y);
    //calculate final position and store as starting point for next drag event
    finalPos = relativePos(event, cx.canvas);
    initPos = finalPos;

    //designate line coordinates and draw.
    cx.lineTo(finalPos.x, finalPos.y);
    cx.stroke();
  },

      //release handler
      onEnd);
}


//draw text on canvas
tools.Text = function(event,cx) {

  //type in text
  var text = prompt("Text:", "")

  //display text at a minimum font size of 7 .
  if (text) {
    var pos = relativePos(event, cx.canvas);
    cx.font = Math.max(7, cx.lineWidth);
    cx.fillText(cx, pos.x, pos.y);
  }
};

//event --> relative position
//context(cx) --> editting the canvas
tools.Spray = function(event,cx) {
  var radius = cx.lineWidth / 2;
  var area = Math.pow(radius, 2) * Math.PI;
  var numDots = area / 30;

  var currentPos = relativePos(event, cx.canvas);

  //start spraying every time you move to new location
  var spray = setInterval(function () {
    //draw dots on canvas every 25 milliseconds
    for (var i = 0; i < numDots; i++) {
      var offset = randomPointInRadius(radius);
      cx.fillRect(offset.x + currentPos.x, offset.y + pos.y, 1, 1);
    }
  }
  , 25);

  trackDrag(function(event,cx){
    currentPos = relativePos(event,cx.canvas);
  }, function(){
    clearInterval(spray);
  })
}




....LLLLLOOOOOKKK OVER THI

//erase by changing the composite operation(how changes
// in the canvas will change the pixels already on the canvas
tools.Erase = function(event, cx) {

  //set pixel-interaction to destination-out(pixels exit canvas when dragged over)
  cx.globalCompositeOperation = "destination-out";

  //use same meachanism as drawing a line but instead erase pixels
  tools.Line(event, cx, function() {

    //reset to normal composite operation(pixel-interaction)
    // when erase process is over(mouse is released)
    cx.globalCompositeOperation = "source-over";
  });
};
























