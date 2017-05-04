'use-strict';


angular.module('app.dashboard')
.controller('botSettingCtrl',function($scope,$window,$interval){
  var sliderThumb = $window.document.getElementsByClassName("md-thumb");
  $scope.abilityDraft = [
    {
      name: 'Expert',
      positiveTitle: 'Expert',
      negativeTitle: 'Novice',
      modelName: 4
    },
    {
      name: 'Cooperative',
      positiveTitle: 'Cooperative',
      negativeTitle: 'Non-Cooperraative',
      modelName: 2
    },
    {
      name: 'Verbose',
      positiveTitle: 'Verbose',
      negativeTitle: 'Non-Verbose',
      modelName: 4
    },
    {
      name: 'Polite',
      positiveTitle: 'Polite',
      negativeTitle: 'Non-Polite',
      modelName: 5
    },

  ];
  $scope.triggerWatch = function(e){
    console.log(e);
  }
  // $scope.$watch("ability.modelName", function(newValue, oldValue) {

  // });
  
});
