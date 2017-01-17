/**
 * Created by DerekJLin on 10/13/16.
 */





PARSE EXPRESSION

FUNCTIONALITY
//We define a function parseExpression, which takes a string as input and
// returns an object containing the data structure for the expression at the
// start of the string, along with the part of the string left after parsing this
// expression. When parsing subexpressions (the argument to an application, for example),
// this function can be called again, yielding the argument expression as well as the text
// that remains. This text may in turn contain more arguments or may be the closing parenthesis that ends the list of arguments.

lOGIC:
//parse the first  expression at the start of string
//parsethe expressions within the expressoins
//parse the remaining text in the inner expressions

//DOES IT ONLY PARSE THE FIRST EXPRESSION? BUT IT NEVER GETS TO TEH SECOND ONE?!!!!
function parseExpression(program) {


    //cutt off excess whitespace
    program = skipSpace(program);

    //match - store RAW ELEMENTS OF PROGRAM
    //expr - store RAW ELEMENTS and REST OF CODE
    var match, expr;

    //obtain the raw string value
    if (match = /^"([^"]*)"/.exec(program))
        expr = {type: "value", value: match[1]};

        //obtain the raw number value
    else if (match = /^\d+\b/.exec(program))
        expr = {type: "value", value: Number(match[0])};

        //obtain the VARIABLE/operator( aka word)
    else if (match = /^[^\s(),"]+/.exec(program))
        expr = {type: "word", name: match[0]};
    else
        throw new SyntaxError("Unexpected syntax: " + program);


    ///get rid of the expression part of the slice
    return parseApply(expr, program.slice(match[0].length));
}



//cut off the spaces from the string
function skipSpace(string) {


    //get the first index where there is no whitespace
    var first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}



///////HELP EM VISUALIZE THIS!!!!!////////

// AN APPLICAITON HAS A ( AND ).
//checks whether the expression is an application. If so,
//it parses a parenthesized list of arguments.
function parseApply(expr, program) {

    //get rid of possilbe leading space
    program = skipSpace(program);

    //“next character in the program is not an opening parenthesis, this is not an application,
    // and parseApply simply returns the expression it was given.”

    //not an application

    //cases:
    //  function() without arguments
    //
    //CHECK IF THERE ARE ANY OTHER INNER FUNCTIONS
    //BY CHECKING IF THERE IS ANOTHER "(" FUNCTION,
    if (program[0] != "(")

        //NOT AN APPLICATION
        //return DATA STRUCTURE REPRESENTING VALUE, AND VARIABLES(STRINGS AND ETC)
        return {expr: expr, rest: program};

    //cut off parentheses and the spaces
    program = skipSpace(program.slice(1));

    //create object represenation of application if not a function(application)
    expr = {type: "apply", operator: expr, args: []};

    //CHECK IF FUNCTION HAS ARGUMENTS
    //YES - APPLICATION and HAS ARGUMENTS
    //NO - NOT AN APPPLICATION --> RETURN FUNCTION()
    while (program[0] != ")") {

        //FIND OUT THE TYPE OF THE ARGUMENT
        //REPRESENT IT --> object
        var arg = parseExpression(program);

        //add EXPRESSOIN OBJECT into ENTIRE PROGRAM'S EXPRESSION OBJECT
        expr.args.push(arg.expr);

        //set program to
        // get rid of spaces in agrument

        //WHERE DOES THE OUTER FUNCTION'S IMPLEMENTATOIN GET STORED?
        program = skipSpace(arg.rest);

        // IF THERE IS ANOTHER ARGUMENT, THEN SLICE OFF THE COMMA FROM THE PROGRAM
        // AND PARSE THE NEXT ARGUMENT TO FIND THE TYPE OF EXPRESSION THE NEXT ARGUMENT IS
        if (program[0] == ",")
            program = skipSpace(program.slice(1));

        //CHECK FOR ENDING ")" FOR THE FUNCTION
        else if (program[0] != ")")
            throw new SyntaxError("Expected ',' or ')'");
    }

    //end of function
    //RETURN THE ENTIRE PROGRAM'S EXPRESSION OBJECT
    return parseApply(expr, program.slice(1));
}


//SUCCESSFUL PARSING LEAVES THE REST OF THE PROGRAM SHOULD ALWYAS BE EMPTY.

//give meaning to the syntax of the language and
//check if you have remaining errant program
//return the expresion object.
function parse(program) {

    var result = parseExpression(program);

    if (skipSpace(result.rest).length > 0)
        throw new SyntaxError("Unexpected text after program");

    return result.expr;
}

console.log(parse("+(a, 10)"));
// ▹ {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}”



DEEP WORK LOGIC FOR PARSING PROCESS:
1. REFER TO THE SHEET



Parse Expression = (board)


Evaluator

ASSOCIATES THE EXPRESSION'S ELEMENTS TO IMPLEMENATOIN ADN IMPLEMENTS THEM' +
''
///GETS ARGUMENTS AND EVALUATUES THEM AND PASSES INTO ULTIMATE EXPRESSION.
///CALLS SPECIAL FORMS
///EVALUATES TOPENVIRONEMTN NORMAL VALUEES ANF FUNCITONS

//EVALUATE THE EXPRESSION AS A VARIABL
function evaluate(expr, env) {

    switch(expr.type) {

        VALUE TYPE
        case "value":
            return expr.value;

            FUNCTION  OR LOCAL VARIABLE
        case "word":

            if (expr.name in env)
                return env[expr.name];
            else
                throw new ReferenceError("Undefined variable: " + expr.name);

            FUNCTION? SPECIAL FORM? OR NOT
        case "apply":
            if (expr.operator.type == "word" && expr.operator.name in specialForms)

                //CRATES A LOCAL ENVINROEMTN AND THEN EVALUTES WITH EXPR LOCAL ENVIORNEMNT EACH ARGMENT IN THE SPECIAL FUNCTION.
                return specialForms[expr.operator.name](expr.args, env);


            EVALUATE THE FUNCTION

            var op = evaluate(expr.operator, env);
            if (typeof op != "function")
                throw new TypeError("Applying a non-function.");

            EVALUATE THE ARGUMENTS, AND RECURSIVELY EVALUATE THE INNER ARGUMENT OF THE OUTER EXPRESSION, RETURN THAT
            AND THEN ADD TO ARGUMENTS OF THE OUTER PROGRAM.

            return op.apply(null, expr.args.map(function(arg) {
                return evaluate(arg, env);
            }));
    }
}

there are some funcitons that are special, because they are evaluated differently from normal functions.
    ex: if, while -->
    Thus, we need a speical object othe than

var specialForms = Object.create(null);”

Special Forms


“specialForms["if"] = function(args, env) {
    if (args.length != 3)
        throw new SyntaxError("Bad number of args to if");

    if (evaluate(args[0], env) !== false)
        return evaluate(args[1], env);
    else
        return evaluate(args[2], env);
};




///////////SPECIAL FORMS//////////////



DEEP WORK - SOLVING LOGIC




CREATE AN OBJECT WITHOUT PROTOTYPE TO ASSOCIATE SPECIAL FUNCTIONS NAMES <-----> IMPLEMENTAOTIN

var specialForms = Object.create(null);


//TERNARY IF
specialForms["if"] = function(args, env) {
    if (args.length != 3)
        throw new SyntaxError("Bad number of args to if");

    if (evaluate(args[0], env) !== false)
        return evaluate(args[1], env);
    else
        return evaluate(args[2], env);
};

//
specialForms["while"] = function(args, env) {
    if (args.length != 2)
        throw new SyntaxError("Bad number of args to while");

    while (evaluate(args[0], env) !== false)
        evaluate(args[1], env);

    // Since undefined does not exist in Egg, we return false,
    // for lack of a meaningful result.
    return false;
};

specialForms["do"] = function(args, env) {
    var value = false;
    args.forEach(function(arg) {
        value = evaluate(arg, env);
    });
    return value;
};

specialForms["define"] = function(args, env) {
    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of define");
    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
};

LOGIC:
    DEFINE A FUNCITON AND CALL IT AT THE SAME TIME AND DETERMINE HOW IT IS CALLED.

    FUNCTIONS HAVE THEIR OWN LOCAL ENVIRIONMENT
specialForms["fun"] = function(args, env) {


    DEFINE Function

    if (!args.length)
        throw new SyntaxError("Functions need a body");

    function name(expr) {
        if (expr.type != "word")
            throw new SyntaxError("Arg names must be words");

        return expr.name;
    }

    DEFINE NUMBER OF ARGUMENTS
    var argNames = args.slice(0, args.length - 1).map(name);

    COLLECT BODY
    var body = args[args.length - 1];


    DETERMINE EXEUCTION OF FUNCTION
    return function() {


        if (arguments.length != argNames.length)
            throw new TypeError("Wrong number of arguments");

        CREATE LOCAL ENVIORNMENT HAS ACCESS TO VARIABLES OUTSIDE OF THE EFUNCOTIN
        var localEnv = Object.create(env);

        //ASSIGN PARAMETERS AND LOCAL VARIABLES
        for (var i = 0; i < arguments.length; i++)
            localEnv[argNames[i]] = arguments[i];

        return evaluate(body, localEnv);
    };
};






GLOBAL ENVIORNMENT STORED IN AN OBJECT

//ENVIRONMENT THAT CONTIANS NORMAL OPERATORS AND VALUES
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;


["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
    topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
    console.log(value);
    return value;
};










function run() {

    //GIVE ENVIORNMENT NORMAL OPERATORS
    var env = Object.create(topEnv);

    //ARRAY LIKE --> ARRAY(SLICE) ---> STRING WITH LINES OF CODE

    SLICE TURNS AN ARRAY-LIKE OBJECT INTO AN ARRAY.
    var program = Array.prototype.slice
        .call(arguments, 0).join("\n");

    //EALUATE THE EXPRESSOIN OBJECTS CREATED
    return evaluate(parse(program), env);
}








