/**
 * Created by DerekJLin on 10/26/16.
 */



////ADD TO PAINT PROGRAM


Questions:

1. why is it that the tracking rectangles have to be absolutely positioned?
    2. why do we have to use two cooridnate systems

////draw rect////
<!doctype html>
<script src="code/chapter/19_paint.js"></script>

    <script>

    //ALLOWS US TO GET ABSOLUTE COORDINATES OF RECT
    function rectangleFrom(a, b) {
        return {
            //get starting point
            left: Math.min(a.x, b.x),
            top: Math.min(a.y, b.y),
            //get dimensions
            width: Math.abs(a.x - b.x),
            height: Math.abs(a.y - b.y)};
    }

tools.Rectangle = function(event, cx) {
    //get relative initial TO USE FOR FILLING UPON RELEASE
    var relativeStart = relativePos(event, cx.canvas);

    //get absolute initial TO USE FOR TEMPORAL RECT FROM DRAG
    var pageStart = {x: event.pageX, y: event.pageY};

    //set up the node that displays the
    var trackingNode = document.createElement("div");
    trackingNode.style.position = "absolute";
    trackingNode.style.background = cx.fillStyle;
    document.body.appendChild(trackingNode);

    //upon mousedown, tools.control creates the trackdrag event
    //listeners and then updates UI according ot interactions
    trackDrag(function(event) {

            //upon drag.
            //get coordinates of a rectangle.
            var rect = rectangleFrom(pageStart,
                {x: event.pageX, y: event.pageY});
            //lay out the thing but don't actually fill by changing the div nocde dimensions
            trackingNode.style.left = rect.left + "px";
            trackingNode.style.top = rect.top + "px";
            trackingNode.style.width = rect.width + "px";
            trackingNode.style.height = rect.height + "px";
        },
        //upon release
        function(event) {

            //create the final rect
            var rect = rectangleFrom(relativeStart,
                relativePos(event, cx.canvas));

            //ACTUALLY FILL THE RECTANGLE
            cx.fillRect(rect.left, rect.top, rect.width, rect.height);

            //remove the TEMPORARY RECT
            document.body.removeChild(trackingNode);
        });
};
</script>

<link rel="stylesheet" href="css/paint.css">
    <body>
    <script>createPaint(document.body);</script>
</body>




    ////pick color///

//get color helper function.
function colorAt(cx, x,y){

    //returns an array of rgb values
    var pixel = cx.getImageData(x,y,1,1);

    //because fillstyl strokestyle take in rgb(n, n,n)
    return "rgb(" + pixel[0] + ", " + pixel[1] + ", "+ pixel[2] + ")";

}

//crate tools method property

tools["pick color"] = function(event, cx){

    //get position of mouse relative to canvas and not page.
    var pos = relativePos(event, cx.canvas);

    try{
        var color = colorAt(cx,pos.x,pos,y);
    }
    catch (e){
        if (e is instanceof SecurityError){
            alert("unable to access");
            return;
        }
        else
            throw e;
    }

    ///chnage color of the canvas
    cx.fillStyle = color;
    cx.strokeStyle = color;
}



////flood fill////
    //Questions:
    // why is there mulitply by 4?????????????



        ///logic:

        ///string together an array of same colored pixels from the first pixel clicked, by storing all of the same-colored neighbors of the
    // starting pixel(and subsequently produced neighbors) in an array(work-list: holds positions)
    // and keeping track of all filled positions(no redundancy)

        //set up
        //array storing all filled pixels initially on canvas
        //higher order function for executing on neighbors of a position -- calls a function(same color) on each neighbor.
        //isSameColor for checking two pixels are of the same color.
        //iteration thorugh worklist that checks if the
//
<!doctype html>
<script src="code/chapter/19_paint.js"></script>

    <script>
    // Call a given function for all horizontal and vertical neighbors
    // of the given point.
    function forAllNeighbors(point, fn) {
        fn({x: point.x, y: point.y + 1});
        fn({x: point.x, y: point.y - 1});
        fn({x: point.x + 1, y: point.y});
        fn({x: point.x - 1, y: point.y});
    }

// Given two positions, returns true when they hold the same color.
function isSameColor(data, pos1, pos2) {

    //why is there mulitply by 4?????????????
    var offset1 = (pos1.x + pos1.y * data.width) * 4;
    var offset2 = (pos2.x + pos2.y * data.width) * 4;

    //get the data property of the imageData
    for (var i = 0; i < 4; i++) {
        if(data.data[offset1] != data.data[offset2])
            return false;
    }
    return true;
}

tools["Flood fill"] = function(event, cx) {

    var startPos = relativePos(event, cx.canvas);

    //retrive the array of pixels in the canvas
    //returns an imageData object that contains width, height, and pixel-color information 1-d array
    var data = cx.getImageData(0, 0, cx.canvas.width,
        cx.canvas.height);

    // An array with one place for each already-filled smaecolored pixel in the image.
    var alreadyFilled = new Array(data.width * data.height);

    // This is a list of same-colored pixel coordinates that we have
    // not handled yet.
    var workList = [startPos];

    //filling in the working pixels needed to be filled
    //and filling only the ones that need to be filled
    while (workList.length) {

        //remove and get the most recent same-colored pixel's coordinate
        var pos = workList.pop()

        //retrieve position of pixel in array of already filled pixels
        var offset = pos.x + (pos.y * data.width)

        //ignore already filled same colored pixels
        if (alreadyFilled[offset])
            continue;

        //fill smae colored pixel and record already filled
           cx.fillRect(pos.x, pos.y, 1,1);
            alreadyFilled[pos] = true;

        //and check if any of their neighbors are of the same color and record into an array
       forAllNeighbors(pos, function(neighbor){
           if(neighbor.x >= 0 && neighbor.x <= data.width && neighbor.y >= 0 && neighbor.y <= data.height &&
               isSameColor(data, startPos, neighbor))
                   workList.push(neighbor);
       }
    }
};
</script>

<link rel="stylesheet" href="css/paint.css">
    <body>
    <script>createPaint(document.body);</script>
</body>














