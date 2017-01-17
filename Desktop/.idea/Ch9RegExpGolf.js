/**
 * Created by DerekJLin on 10/12/16.
 */

/*

//Regexp Golf//


Code golf is a term used for the game of trying to express a particular program in as few characters as possible. Similarly, regexp golf is the practice of writing as tiny a regular expression as possible to match a given pattern, and only that pattern.
    For each of the following items, write a regular expression to test whether any of the given substrings occur in a string. The regular expression should match only strings containing one of the substrings described. Do not worry about word boundaries unless explicitly mentioned. When your expression works, see whether you can make it any smaller.


1. car and cat
2. pop and prop
3. ferret, ferry, and ferrari
4. Any word ending in ious
5. A whitespace character followed by a dot, comma, colon, or semicolon
6. A word longer than six letters
7. A word without the letter e
Refer to the table in the chapter summary for help. Test each solution with a few test strings.

*/

/*
//1

/ca[rt]/.test("cat");

//2
/[op]/.test("prop");

//3
/\bferr\w/.test("ferrari")

//4
/ious\b/.test("dfkdjfkdjkiousious")

/ious$/.test("dfkdjfkdious")

//5 whats a \b and $ and ^ the difference between the two? the below should be wrong?
> /\s[.:;,]+\b/.test("  &%#@^&*$%%f")
< true = $2
    > /\s[^/w]+$/.test("  &%#@^&*$%%f")
< true = $2
    > /\s[^/w]+/.test("  &%#@^&*$%%f")
< true = $2

solution: /\s\W/.test("  &%#@^&*$%%f")

//6
/\w{7,}/.test("djkfdksjfkj")

//7
/\b[a-df-z]+\b/i.test("jkfdksjfke")

*/

/*
//Quoting Style:

var text = "'I'm the cook,' he said, 'it's my job.'";

LOGIC:

//REGULAR EXRESSIONS ALLOW YOU TO REPLACE A SECTION OF A STRING THAT MATCHES A PATTERN WITH ELEMENTS +
//SUBGROUPS(PARTS) OF THE MATCHED SECTION.

//parenthesis - subgroups can be used as elements in the replacemnet process
//expression - locates the pattern in the string to be replaced
console.log(text.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));
// → "I'm the cook," he said, "it's my job."

*/



//Matching JS-numbers

/^[+|-]?(\d+(\.\d*)?|\.\d+)([eE]?[-|+]?\d+)?$/.test("5.5")

//DONE.



5.5

5.

.5


-1

-1.0

1

+1

1Ee10

1.0eE10

1.0eE-10

Question:

5 whats a \b and $ and ^ the difference between the two? the below should be wrong?












