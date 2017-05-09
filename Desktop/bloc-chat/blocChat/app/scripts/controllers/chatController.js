(function(){
  function chatController(Room){
    this.rooms = Room.all;
  }
  
  angular
    .module('blocChat')
    .controller('chatController', ['Room', chatController]);
})();