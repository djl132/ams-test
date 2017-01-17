/**
 * Created by DerekJLin on 10/6/16.
 */

//VECTOR TYPE
/*
 GOAL:
 Write a constructor Vector that represents a vector in two-dimensional space.
 It takes x and y parameters (numbers), which it should save to properties of the same name.
 Give the Vector prototype two methods, plus and minus, that take another vector
  as a parameter and return a new vector that has the sum or difference of the
  two vectors’ (the one in this and the parameter) x and y values.
 Add a getter property length to the prototype that computes the length of the
 vector—that is, the distance of the point (x, y) from the origin (0, 0).
 ”

 Excerpt From: Marjin, Haverbeke. “Eloquent Javascript, 2nd Ed.” iBooks. https://itun.es/us/-neB5.l*/


function Vector(x,y){
    this.x = x;
    this.y = y;
}


Vector.prototype.plus = function(v){
    return new Vector(this.x + v.x, this.y + v.y);
}


Object.defineProperty(Vector.prototype, "length",
    {get: function(){return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))} }
    );

//------------- PASSED!!!! ------------//


//ANOTHER CELL// ---------------- HELP!!!!!!!!!!!

//GOAL

/*“Implement a cell type named StretchCell(inner, width, height) that conforms to the
 table cell interface described earlier in the chapter. It should wrap another cell
 (like UnderlinedCell does) and ensure that the resulting cell has at least the given
 width and height, even if the inner cell would naturally be smaller.”
 */

//CODE HERE:


//---------help------//

function StretchCell(inner, width, height) {
    this.inner = inner;
    this.width = width;
    this.height = height;
}

StretchCell.prototype.minWidth = function() {
    return Math.max(this.width, this.inner.minWidth());
};
StretchCell.prototype.minHeight = function() {
    return Math.max(this.height, this.inner.minHeight());
};
StretchCell.prototype.draw = function(width, height) {
    return this.inner.draw(width, height);
};

var sc = new StretchCell(new TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
// → 2
console.log(sc.draw(3, 2));
// → ["abc", "   "]






//SEQUENCE INTERFACE//

/*
//GOAL//:

“Design an interface that abstracts iteration over a collection of values. An object that provides this interface
represents a sequence, and the interface must somehow make it possible for code that uses such an object to iterate
over the sequence, looking at the element values it is made up of and having some way to find out when the end of
the sequence is reached. When you have specified your interface, try to write a function logFive that takes a sequence
object and calls console.log on its first five elements—or fewer, if the sequence has fewer than five elements.
Then implement an object type ArraySeq that wraps an array and allows iteration over the array using the interface
you designed. Implement another object type RangeSeq that iterates over a range of integers (taking from and to
arguments to its constructor) instead.”*/


//CODE//

//is logFive an interface?
// an interface is a method through which one can interact with an object without
// directly changing its properties(good encapsulation).

//used on an abstract sequence of data
function logFive(seq){
    for (var i = 0; i < 5; i++){
        //moving pointer into the array and then console.logging
        if(next()) {
            console.log(seq.current());
        }
        break;
    }
}

//Arrays
function seqArray(array){
    this.array = array;
    this.pos = -1
}

//check if there is a next value
//and increment the position(pos) pointer
//starting the pointer from outside of the array and entering on the first iteration.
seqArray.prototype.next = function(){
    if(this.pos >= this.array.length - 1){
        return false;
    }
    pos++;
    return true;
}


seqArray.prototype.current = function(){
    return this.array[this.pos];
}


function seqRange(from,to){
    this.pos = from - 1;
    this.to = to;
}



seqRange.prototype.next = function(){
    if(this.pos >= this.to)
        return false;
    pos++;
    return true;
}

seqRange.prototype.current = function(){
    return this.pos;
}

//IF YOU HAVE TIME LOOK AT THE ALTERNATE WAY OF DOING IT.


//ALTERNATIVE//

// This alternative approach represents the empty sequence as null,
// and gives non-empty sequences two methods:
//
// * head() returns the element at the start of the sequence.
//
// * rest() returns the rest of the sequence, or null if there are no
//   elemements left.
//
// Because a JavaScript constructor can not return null, we add a make
// function to constructors of this type of sequence, which constructs
// a sequence, or returns null if the resulting sequence would be
// empty.

function logFive2(sequence) {
    for (var i = 0; i < 5 && sequence != null; i++) {
        console.log(sequence.head());
        sequence = sequence.rest();
    }
}

function ArraySeq2(array, offset) {
    this.array = array;
    this.offset = offset;
}
ArraySeq2.prototype.rest = function() {
    return ArraySeq2.make(this.array, this.offset + 1);
};
ArraySeq2.prototype.head = function() {
    return this.array[this.offset];
};
ArraySeq2.make = function(array, offset) {
    if (offset == null) offset = 0;
    if (offset >= array.length)
        return null;
    else
        return new ArraySeq2(array, offset);
};

function RangeSeq2(from, to) {
    this.from = from;
    this.to = to;
}
RangeSeq2.prototype.rest = function() {
    return RangeSeq2.make(this.from + 1, this.to);
};
RangeSeq2.prototype.head = function() {
    return this.from;
};
RangeSeq2.make = function(from, to) {
    if (from > to)
        return null;
    else
        return new RangeSeq2(from, to);
};

logFive2(ArraySeq2.make([1, 2]));
// → 1
// → 2
logFive2(RangeSeq2.make(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104

//LOGic:
/*
1. it works just liek a pointer system we did to splice DNA.
*/

































