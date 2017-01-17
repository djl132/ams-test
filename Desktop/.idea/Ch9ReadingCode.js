    /**
 * CHAPTER 9 - REGULAT EXPRESSIONS
 */


//PARSE INI:

/*

searchengine=http://www.google.com/search?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[gargamel]
fullname=Gargamel
type=evil sorcerer
outputdir=/home/marijn/enemies/gargamel
 */


//REGULAR EXPRESSIONS

//LOOPING OVER MATCHES
//UES A LOOP AND REGULAR EXPRESSION TO PRINT OUT LINE BY LINE THE
// MATCHING content and index of match.
//USING CONCEPT FO SUBGROUP.


//GOAL:
//store content of  a string in INI format to an object with name proprety
// and an array of objects with properties(settigns) and values

//Questoin: where does it start another section in this code

    //LOgic:

    //1. executions that are sequential use a reusable object

    //create an object that holds specific characteristics
    //append to that object whenever needed to pass that value into another structure
    //and then when you need to clear properties to use another object simply REASSIGN.
    //

function parseINI(string) {


    // Start with an object to hold data of the sections
    //start with an object that holds data if here is no name
    //Principle: reusable object to avoid repetition
    var currentSection = {name: null, fields: []};

    //array that stores currentSections
    var categories = [currentSection];

    //split string into array of indiivdual string words.
    string.split(/\r?\n/).forEach(function (line) {

        var match;

        //GET RID OF COMMENTS
        if (/^\s*(;.*)?$/.test(line)) {
            return;

            //get the properties
            //
        } else if (match = line.match(/^\[(.*)\]$/)) {

            currentSection = {name: match[1], fields: []};
            categories.push(currentSection);

            //get the properties and values and store in object's fields.
            //MODIFY PREVIOUS OBJECT CREATED
        } else if (match = line.match(/^(\w+)=(.*)$/)) {

            currentSection.fields.push({
                name: match[1],
                value: match[2]
            });

        } else {
            throw new Error("Line '" + line + "' is invalid.");
        }
    });

    return categories;
}

