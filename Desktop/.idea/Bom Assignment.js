/**
 * Created by DerekJLin on 10/20/16.
 */


for(var property in navigator){
    var str = navigator[property]
    document.write(property+ "&nbsp;&nbsp;<em>"+str+"</em><br />");
}


document.write(parseFloat(navigator.appVersion).toFixed(1));




///display the batteyr status

navigator.getBattery().then(function(battery) {

    console.log("Battery level: " + battery.level * 100 + " %");

    battery.addEventListener('levelchange', function() {
        console.log("Battery level: " + battery.level * 100 + " %");
    });

});


// This example fetches the current charging state of the battery and establishes a handler
// for the chargingchange event, so that the charging state is recorded whenever it changes.

navigator.getBattery().then(function(battery) {
    console.log(battery.charging)
});





5. Write a program to check whether the User is Online or Not and explain the scenarios where would you use this functionality and what would be the steps you might take when the user is indeed offline. Just one liners can be fine. No programs required.



4. Create a program on inheritance. Any simple Program showing how inheritance works would do.
