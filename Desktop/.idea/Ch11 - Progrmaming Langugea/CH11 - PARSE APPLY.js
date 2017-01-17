/**
 * Created by DerekJLin on 10/13/16.
 */

// AN APPLICAITON HAS A ( AND ).
//checks whether the expression is an application. If so,
//it parses a parenthesized list of arguments.
function parseApply(expr, program) {

    program = skipSpace(program);

    //“next character in the program is not an opening parenthesis, this is not an applic
    // and parseApply simply returns the expression it was given.”

    //not an application
    if (program[0] != "(")

    //DATA STRUCTURE REPRESENTING VALUE, WORD
        return {expr: expr, rest: program};

    //if next character is not a closing parentheses, then skip parenthese
    program = skipSpace(program.slice(1));

    //create object represenation of application
    expr = {type: "apply", operator: expr, args: []};

    //
    while (program[0] != ")") {

        //create object repres expression
        var arg = parseExpression(program);

        //add object into argument
        expr.args.push(arg.expr);

        //WHAT DOES THIS LINE DO1!!!!!!!!??????
        //WHERE DOES REST COME FROM?
        program = skipSpace(arg.rest);


        if (program[0] == ",")
            program = skipSpace(program.slice(1));
        else if (program[0] != ")")
            throw new SyntaxError("Expected ',' or ')'");
    }
    return parseApply(expr, program.slice(1));
}
