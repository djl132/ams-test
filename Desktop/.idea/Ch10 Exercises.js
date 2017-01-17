/**
 * Created by DerekJLin on 10/25/16.
 */


//////EXERCISE 1:

    ///QUESTION: HOW DOES THE SYNTAX MAKE THE FUNCTION IMPLEMENTATION PRIVATE BUT EXPOSE EXECUTION?

var months = function(){

    var monthArray = ["Jan", "feb", "mar", "apr", "may", "june", "july"];

    //return an object interfae whose methods are available but implementation is not visible.

    ///BY PUTTING THE RETURN FUNCTIONS IN A SEPARATE SCOPE I EXPOSE METHODS AS PROPERTIES BUT IMPLEMENATATION IS NOT ACCESSIBLE.?????
    return {

        monthToNumber: function(month) {return monthArray.indexOf(month);}
        numberToMonth: function(number) {return monthArray[number];}

    }
}();


interface:

    monthToNumber

    numberToMonth



