"use strict";


angular.module('app.layout', ['ui.router','ngMaterial'])

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    abstract: true,
    views: {
      root: {
        templateUrl: 'app/layout/layout.tpl.html'
      }
    }
  });
  $urlRouterProvider.otherwise('/dashboard');

})
.controller('headerController',function($scope,$state,$rootScope){
  $scope.state = $state;
  $scope.setting = {
    text: "setting",
    current: false
  };
  $scope.dashboard = {
    text: "dashboard",
    current: false
  };
   $scope.analytic = {
    text: "analytic",
    current: false
  }
  var currentStateName = $scope.state.current.name.substring(4);
  switch(currentStateName){
    case "bot-setting":
    $scope.setting.current = true;
    break;
    case "dashboard":
    $scope.dashboard.current = true;
    break;
    case "dashboard-analytic":
    $scope.analytic.current = true;
    break;
  }
  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
    var stateName = toState.name;
    var stateNow = stateName.substring(4);
    console.log(stateNow);
    switch(stateNow){
      case "bot-setting":
      $scope.setting.current = true;
      $scope.dashboard.current = false;
      $scope.analytic.current = false;
      break;
      case "dashboard":
      $scope.dashboard.current = true;
      $scope.setting.current = false;
      $scope.analytic.current = false;
      break;
      case "dashboard-analytic":
      $scope.analytic.current = true;
      $scope.setting.current = false;
      $scope.dashboard.current = false;
      break;
    }
  });

  
  
  
})

