var socialMedia = {
    facebook : 'http://facebook.com/viewsource',
    twitter: 'http://twitter.com/planetoftheweb',
    flickr: 'http://flickr.com/planetotheweb',
    youtube: 'http://youtube.com/planetoftheweb'
};



function createBanner(selector, object){

    object = Object.create(null);

    //get elements with selector
    var selected = document.body.querySelectorAll(selector);

    //use browser's forEach method to iterate through nodelist produced
    selected.forEach(function(item){
        item.parentNode.removeChild(item);
    });

    //create banner
    var banner = elt("nav", "socialmediaicons");
    banner.appendChild(elt("ul"));


    for (var site in object){
        var li = elt("li");

        //add link
        var link = elt("a");
        link.setAttribute("href",object[site]);

        //link image
        var img = elt("img", "socialmediaicons");
        img.src = "images/" + site + ".png"

        link.appendChild(img);
        li.appendChild(link);
    }

    return banner;
}


function elt(tagname, className){

    var element = document.body.createElementByTagName(tagname);
    element.className = className;
    return element;

}
