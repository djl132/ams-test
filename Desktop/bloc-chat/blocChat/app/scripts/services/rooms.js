
//A Factory Service that exposes backend room information to eh chatController managing the chat app's View
(function() {
  function Room($firebaseArray){
    var ref = firebase.database().ref().child("rooms"); //get json array of rooms aka accessing rooms array in the root database json object.
    var rooms = $firebaseArray(ref);//gets jsarray-form of rooms array
    
    //return array with data
    return {
      all: rooms
    };
  }

  angular
    .module('blocChat')
    .factory('Room', ['$firebaseArray', Room]);
})();