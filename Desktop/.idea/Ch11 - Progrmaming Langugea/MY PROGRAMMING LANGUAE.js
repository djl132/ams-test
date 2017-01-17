/**
 * Created by DerekJLin on 10/16/16.
 */


//////////////////////////////////////////////////
/////////////////PROGRAMMING LANGUAGE/////////////
//////////////////////////////////////////////////



//find out SYNTAX TYPE
function parseExpression(program) {

    //skip leading space
    program = skipSpace(program)


    //hold the matched part of string to cut off from the program in order to parse the rest of the program if there
    // are additional arguments.
    // and expression object
    var match, expr;

    //string
    if (match = /^"([^"]*)"/.exec(program))
        expr = {type: "word", value: match[1]}

    //number
    if (match = /\d+/.exec(program))
        expr = {type: "value", value: match[0]}


    //take first occurence of match
    //a word that could be a function, variable, argument, or operator
    if (match = /[^\s(),"]+/.exec(program))
        expr = {type: "word", name: match[0])

    else
        throw new SyntaxError("Unexpected syntax: " + program);

    //get rest of implementatoin, if there is any, of expression
    return parseApply(expr, program.slice(match[0].length))
}



//skip space//
//cut off leading spaces
function skipSpace(program){

    //get index of the first nonwhitespace
    var skippable = /^(\s|#.*)*/.match(program)
    program.slice(skippable[0].length)
}


//construct expression object to represent meaning of the expression
//check if expression is FUNCTION TYPE
//iterating through the expression's arguments if it has any
function parseApply(expr, rest){

    program = skipSpace(program)

    //check if expression is a function by checking if ( preceds the expression
    if (program[0] != "(")
        return {expr: expr, rest: rest};

    //cur off ( and skip whitespace
    program = skipSpace(program[0])

    //recreate expression to be a function
    expr = {type: "function", desc: expr, args: []};

    //check if empty function or function with argument by checking )
    if (program[0] != ")"){

        //find syntax of argument
        //store rest of expression in arg.
        var arg = parseExpression(program)

        expr.args.push(arg.expr)

        //reassign program with argument's rest property and cutt of spaces
        program = skipSpace(arg)

        //if more arguments
        if(program[0] == ","){
            program = skipSpace(program.slice(1))
        }

        //empty function or syntax error
        else if(program[0] != ")"){
            throw new SyntaxError("Expected ',' or ")"")
        }

        return parseApply(expr, program.slice(1));

    }

}

}


//check if the program was parsed succesfully
function parse(program){

    var result = parseExpression(program);

    if(result.rest.length != 0)
        throw new SyntaxError(unexpected trailed text.)

    return result;
}



function evaluate(expr, env) {
    switch (expr.type) //value type
        case "value":
            return expr.value;

        //variable
        case "word":
            if (expr.name in env)
                return expr.name;
            throw new ReferenceError(expr.name + "is undefined.")

        case "apply":

            //check if special form and evaluate with arguments
            if (expr.operator.name in specialForms) {

                //evaluates arguments of specialForm
                return specialForms[expr.operator.name](expr.args, env)
            }

//EVALUATE FUNCTIONS
// it is a new function and evaluate with arguments
            var op = evaluate(expr.operator, env)

            if typeof newFunction != "function"
                throw new SyntaxError("applying non-function")
            //recursively evaluate inner expressions(arg's) and
            //pass the result to outer epxression and evaluate outer expression
            return op.expr.name.apply(null,op.args.map(function(arg){
                return evaluate(arg, env);
            }))
    }



    //////special forms//////




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

var specialForms = Object.create(null);

specialForms["if"] = function(args, env) {
    if (args.length != 3)
        throw new SyntaxError("number of arguments is wrong")
    if (evaluate(args[0], env) === true)
        return evaluate(args[1], env);
    else
        return evaluate(args[2], env)
}


specialForms["while"] = function(args, env){
    if (args.length != 2)
        throw new SyntaxError("number of arguments is wrong")
    while(evaluate(args[0], env) === true)
        evaluate(args[1], env)
    else
        return false;
}

///////WHAT DOES "do" DO?????/////
specialForms["do"] = function(args, env){
    var value = false;

    args.forEach(function(arg){
        value = evaluate(arg, env)
    })

    return value;
}

//DEFINE A VARIABLE
specialForms["define"] = function(args, env){

    if(args.length != 2 || args[0].type != word)
        throw new SyntaxError("The Name of value is not defined")
    var value = evaluate(args[1], env)


    //store in local or global environment
    env[args[0].name] = value;

    return value;
}


LOGIC:
    DEFINE A FUNCITON AND CALL IT AT THE SAME TIME AND DETERMINE HOW IT IS CALLED.

    FUNCTIONS HAVE THEIR OWN LOCAL ENVIRIONMENT


specialForms["fun"] = function(args, env){


    /////GIVE PROPERTIES TO THE FUNCTION

    //why not more than 1????? just 1????????
    if(!args.length)
        throw new SyntaxError("functions need a body")

    function name(expr){
        if(expr.type != word)
            throw new SyntaxError("Arg names must be words")

        ////WHAT IF IT IS AN OPREATOR????/////
        return expr.name;
    }

    //record parameter names
    var argNames = args.slice(0,args.length - 1).map(name);

    var body = args[args.length - 1];

    //////specify implementation
    return function() {

        if (arguments.length != argNames.length)
            throw new TypeError("wrong number of arguments")

        var localEnv = Object.create(env);

        for (var i = 0; i < arguments.length; i++)
            localEnv[argNames[i]] = arguments[i];

        //gives an inner functions it sown scope and context
        return evaluate(body, localEnv);
    };


}



GLOBAL ENVIORNMENT STORED IN AN OBJECT

//ENVIRONMENT THAT CONTIANS NORMAL OPERATORS AND VALUES
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;

topEnv["array"] = function(){
    return Array.prototype.slice.call(arguments,0)
}

topEnv["length"] = function(array){
    return array.length;
}

topEnv["element"] = function(array,i) {
    return array[i];
}

/////add global basic functions
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op){
    topEnv[op] = new Function("a,b", "return a" + op + "b;" )
})
;

topEnv["print"] = function(value){
    console.log(value);
    return value;
}


function run() {

    //create environment for associating names with values and implementations
    var prgEnv = Object.create(topEnv);

    ///////WHY NOT JUST CALL IT DIRECTLY??????//////
    var program = Array.prototype.slice.call(arguments, 0).join("/n");

    return evaluate(parse(program), prgEnv);
}

specialForms["set"] = function(args, env){

    if (args.length != 2 || args[0].type != word)
        throw new SyntaxError("not enough arguments")

    var name = args[0].name

    //obtain the value of the variable
    var value = evaluate(args[1], env)

    for( var scope = env; scope; scope = Object.getPrototypeOf(scope)) {
        scope[name] = value;
        return value;
    }
    throw new ReferenceError("Setting undefined variable " + varName);
};