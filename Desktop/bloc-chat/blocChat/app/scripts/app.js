(function(){

  
  //CONFIURE(ROUTE) EACH OCNTROLLER,VIEW,URL TO A SPECIFIC STATE(UNIQUE BEHAVIORAL PLACE IN APP) and change UIVIEW based on state.
  function config($locationProvider, $stateProvider){
    $locationProvider
      .html5Model({
        enabled: true,
        requireBase: false
    });
    
    $stateProvider
      .state('home', {
        url:'/',//informs Angular that it is root.
        templateUrl: '/templates/home.html',
        controller: 'chatController as chat'
    });
  
  }
  
  
  angular
    .module('blocChat', ['firebase','ui.router'])
    .config(config); // create provider service using uirouter to configure controllers(components) managing the app by states(wireframes)
})();
