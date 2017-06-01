'use-strict';


angular.module('app.dashboard')
.controller('botSettingCtrl',function($scope,$window,$interval){
  var sliderThumb = $window.document.getElementsByClassName("md-thumb");
  $scope.containerLayout = {
    height: $window.innerHeight * 50 /100
  }
  $scope.abilityDraft = [
    {
      name: 'Expert',
      positiveTitle: 'Expert',
      negativeTitle: 'Novice',
      modelName: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20, 
        'r':15,
        color: 'dark green'
      }
    },
    {
      name: 'Cooperative',
      positiveTitle: 'Cooperative',
      negativeTitle: 'Uncooperative',
      modelName: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20, 
        'r':15,
        color: 'blue'
      }
    },
    {
      name: 'Verbose',
      positiveTitle: 'Verbose',
      negativeTitle: 'Concise',
      modelName: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20, 
        'r':15,
        color: 'green'
      }
    },
    {
      name: 'Polite',
      positiveTitle: 'Polite',
      negativeTitle: 'Impolite',
      modelName: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20, 
        'r':15,
        color: 'red'
      }
    },

  ];
  // $scope.$watch("ability.modelName", function(newValue, oldValue) {

  // });
  
});
