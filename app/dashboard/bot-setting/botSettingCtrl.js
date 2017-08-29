'use-strict';
angular.module('app.dashboard')
.controller('botSettingCtrl',function($scope,$window,$interval,$firebaseObject,$firebaseArray,$mdToast){
  const refData = firebase.database().ref();
  const settingRef = refData.child('settings');
  const personalitySettingRef = refData.child('settings').child('personalities');
  var query = settingRef.orderByChild("timestamp").limitToLast(5);
  $scope.settings = $firebaseArray(query);
  var sliderThumb = $window.document.getElementsByClassName("md-thumb");

  $scope.showToast = function (message, parentId,className) {
    var el = angular.element(document.getElementById(parentId));
    
    var toast = $mdToast.simple()
    .content(message)
    .action('OK')
    .position('bottom right')
    .hideDelay(3000)
    .toastClass(className)
    .parent(el);
    $mdToast.show(toast);
  };


  $scope.personalitySetting = {
    toBeSave: {
      novice: 50,
      cooperative: 50,
      verbose: 50,
      polite:50
    },
    buttonDisable: true,
    personalitySettingList: $firebaseArray(personalitySettingRef),
    save: function(){
      var onComplete = function(){
        console.log("completed");
      }
      var numberOfitems = this.personalitySettingList.length;
      if((this.toBeSave.title == "" || this.toBeSave.title === undefined) || numberOfitems === 0){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        personalitySettingRef.orderByChild("title").equalTo(this.toBeSave.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','personality-toast','toast-error');
        }else{
          var id = "personality_"+(numberOfitems+1).toString();
          personalitySettingRef.child(id).set(this.toBeSave, onComplete);
          $scope.showToast('Personality Saved as '+this.toBeSave.title,'personality-toast','toast-info');
        }
        
      }
    
    }
  }

  $scope.settingsOption={
    personality:{
      novice: 50,
      cooperative: 50,
      verbose: 50,
      polite:50
    }
  };

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
      $scope.personalitySetting.toBeSave.novice  = e.value;
      break;
      case 'Cooperative':
      $scope.personalitySetting.toBeSave.cooperative  = e.value;
      break;
      case 'Verbose':
      $scope.personalitySetting.toBeSave.verbose  = e.value;
      break;
      case 'Polite':
      $scope.personalitySetting.toBeSave.polite  = e.value;
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
    console.log("submit clicked");
    // var exist = false;
    // settingRef.orderByChild("title").equalTo($scope.settingsOption.title).once('value',function(snapshot){
    //   if(snapshot.val() != null){
    //     exist = true;
    //   }else{
    //     exist = false;
    //   }
    // })
    // console.log(exist);
    // if(exist){
    //   console.log("title already exist");
    // }else{
    //   var newPostKey = settingRef.push().key;
    //   var updates = {};
    //   var result = {};
    //   result['title'] = $scope.settingsOption.title;
    //   result['personality'] = $scope.settingsOption.personality;
    //   result['process'] = $scope.settingsOption.process;
    //   updates[newPostKey] = result;
    //   return settingRef.update(updates);
    // }
  };
  this.selectedYear = 0;
  this.years = [];
  this.items = [];
  var currentYear = new Date().getFullYear();
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  // Build a list of months over 2 years
  for (var y = currentYear; y >= (currentYear-2); y--) {
    this.years.push(y);
    this.items.push({year: y, text: y, header: true});
    for (var m = 11; m >= 0; m--) {
      this.items.push({year: y, month: m, text: monthNames[m]});
    }
  }
  // Whenever a different year is selected, scroll to that year
  $scope.$watch('ctrl.selectedYear', angular.bind(this, function(yearIndex) {
    var scrollYear = Math.floor(this.topIndex / 13);
    if(scrollYear !== yearIndex) {
      this.topIndex = yearIndex * 13;
    }
  }));
  // The selected year should follow the year that is at the top of the scroll container
  $scope.$watch('ctrl.topIndex', angular.bind(this, function(topIndex) {
    var scrollYear = Math.floor(topIndex / 13);
    this.selectedYear = scrollYear;
  }));  
});
