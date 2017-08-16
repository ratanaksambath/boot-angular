'use-strict';
angular.module('app.dashboard')
.controller('botSettingCtrl',function($scope,$window,$interval,$firebaseObject,$firebaseArray){
  const refData = firebase.database().ref();
  const settingRef = refData.child('settings');
  var query = settingRef.orderByChild("timestamp").limitToLast(5);
  $scope.settings = $firebaseArray(query);
  var sliderThumb = $window.document.getElementsByClassName("md-thumb");
  $scope.settingsOption={
        personality:{
        novice: 50,
        cooperative: 50,
        verbose: 50,
        polite:50
      }
    };;
  $scope.containerLayout = {
    height: $window.innerHeight * 50 /100
  }
  $scope.objectChange = function(e){

    switch(e.value){
      case 0:
        e.negative.fontSize = 19;
        e.negative.fontWeight = 700;
        e.positive.fontSize = 15;
        e.positive.fontWeight = 100;
        break;
      case 25:
        e.negative.fontSize = 17;
        e.negative.fontWeight = 400;
        e.positive.fontSize = 15;
        e.positive.fontWeight = 100;
        break;    
      case 50:
        e.negative.fontSize = 15;
        e.negative.fontWeight = 200;
        e.positive.fontSize = 15;
        e.positive.fontWeight = 200;
        break;
      case 75:
        e.negative.fontSize = 15;
        e.negative.fontWeight = 100;
        e.positive.fontSize = 17;
        e.positive.fontWeight = 400;
        break;
      case 100:
        e.negative.fontSize = 15;
        e.negative.fontWeight = 100;
        e.positive.fontSize = 19;
        e.positive.fontWeight = 700;
        break;    
    }
    switch(e.name){
      case 'Novice':
      $scope.settingsOption.personality.novice = e.value;
      break;
      case 'Cooperative':
      $scope.settingsOption.personality.cooperative = e.value;
      break;
      case 'Verbose':
      $scope.settingsOption.personality.verbose = e.value;
      break;
      case 'Polite':
      $scope.settingsOption.personality.polite = e.value;
      break;
    }

  }
  $scope.abilityDraft = [
    {
      name: 'Novice',
      positive:{
        name:'Expert',
        fontSize: 15,
        fontWeight: 200
      },
      negative:{
        name:'Novice',
        fontSize: 15,
        fontWeight: 200
      },
      value: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20,
        color: 'dark green'
      }
    },
    {
      name: 'Cooperative',
      positive:{
        name:'Cooperative',
        fontSize: 15,
        fontWeight: 200
      },
      negative:{
        name:'Uncooperative',
        fontSize: 15,
        fontWeight: 200
      },
      value: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20,
        color: 'blue'
      }
    },
    {
      name: 'Verbose',
      positive:{
        name:'Verbose',
        fontSize: 15,
        fontWeight: 200
      },
      negative:{
        name:'Concise',
        fontSize: 15,
        fontWeight: 200
      },
      value: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20,
        color: 'green'
      }
    },
    {
      name: 'Polite',
      positive:{
        name:'Polite',
        fontSize: 15,
        fontWeight: 200
      },
      negative:{
        name:'Impolite',
        fontSize: 15,
        fontWeight: 200
      },
      value: 50,
      svgNode:{ 
        'x': 15, 
        'y': 20,
        color: 'red'
      }
    },

  ];

  $scope.$watchCollection("settingsOption", function(newValue, oldValue) {
    if($scope.settingsOption != null){
      angular.forEach($scope.abilityDraft,function(v,key){
      switch(v.name){
        case 'Novice':
        v.value = newValue.personality.novice;
        break;
        case 'Cooperative':
        v.value = newValue.personality.cooperative;
        break;
        case 'Verbose':
        v.value = newValue.personality.verbose;
        break;
        case 'Polite':
        v.value = newValue.personality.polite;
        break;
      }
      })
    }
    
      
  });
  $scope.submit = function(){
    var title = $scope.settingsOption.title;
    var exist = false;
    settingRef.orderByChild("title").equalTo(title).once('value',function(snapshot){
      console.log(snapshot.val());
      if(snapshot.val() != null){
        exist = true;
      }
    })
    console.log(exist);
    if(exist){
      console.log("title already exist");
    }else{
      var key = settingRef.push();
      
    }
  }
  
});
