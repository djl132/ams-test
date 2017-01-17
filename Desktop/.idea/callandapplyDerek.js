
/**
 * Created by DerekJLin on 10/1/16.
 */

var lion = {
    type: "lion",
    call: "rar!!"

}

var zebra = {
    type: "zebra",
    call: "run away run away!"
}


function speak(salutation){
    console.log(this.type + " says " + salutation + " by saying " + this.call)
}

var array = ["hi", "bye"]


speak.call(lion,"hi");
speak.apply(zebra, array)

if (true) console.log("hi");

value = 0

if (value)

    console.log("not true");



