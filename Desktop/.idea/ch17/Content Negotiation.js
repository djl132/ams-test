/**
 * Created by DerekJLin on 10/19/16.
 */


function getURL(url, mediaType) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.setRequestHeader("accept", mediaType);
        req.send(null);
        return req.responseText;
     }

var types = ["text/plain","text/html", "application/json","application/rainbows+unicorns"]

types.forEach(function(type){

    //can try only because the content is returned synchronously
    try{
    console.log(type + ":\n" + getURL("http://eloquentjavascript.net/author",type), "\n");
    }

    catch(e)
    {
        console.log("Raised error:" + e);
    }

});







