/**
 * Created by DerekJLin on 10/28/16.
 */



///ARRAYS

//converts the array like argumetns object into an array object

topEnv["array"] = function() {
    return Array.prototype.slice.call(arguments);
};

topEnv["length"] = function(array) {
    return array.length;
};

topEnv["element"] = function(array, i) {
    return array[i];
};

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6



function skipSpace(string) {
    //get rid of anythign that begins with a space or anythign with # (nonwhiteasapce)
    var skippable = string.match(/^(\s|#.*)*/);
    return string.slice(skippable[0].length);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "x"},
//    args: []}

//create a function that is distinct from define which only sets value that are in scope or else returns a reference error
specialForms["set"] = function(args, env) {

    if (args.length != 2 || args[0].type != "word")
        throw new SyntaxError("Bad use of set");

    var varName = args[0].name;
    var value = evaluate(args[1], env);

    //go up the heirarchy of scope objects (going through prototypes)
    for (var scope = env; scope; scope = Object.getPrototypeOf(scope)) {

        //use call because the scope objects are not prorotypes of object.prorotyep isince topEnv has no prototype.Obejct.create*(null);
        if (Object.prototype.hasOwnProperty.call(scope, varName)) {
            scope[varName] = value;

            return value;
        }
    }

    throw new ReferenceError("Setting undefined variable " + varName);
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Some kind of ReferenceError
