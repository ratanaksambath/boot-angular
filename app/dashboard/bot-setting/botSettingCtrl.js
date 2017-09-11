'use-strict';
angular.module('app.dashboard')
.controller('botSettingCtrl',function($scope,$window,$interval,$firebaseObject,$firebaseArray,$mdToast,$mdDialog,$timeout){

  const refData = firebase.database().ref();
  const testSettingRef = refData.child('tests');
  const personalitySettingRef = refData.child('settings').child('personalities');
  const processSettingRef = refData.child('settings').child('processes');
  const testSettingListQuery = personalitySettingRef.orderByChild("timestamp");
  const personalitySettingListQuery = personalitySettingRef.orderByChild("timestamp");
  const processSettingListQuery = processSettingRef.orderByChild("timestamp");
  const lastPersonalityChild = personalitySettingRef.orderByChild("timestamp").limitToLast(1);
  const lastProcessChild = processSettingRef.orderByChild("timestamp").limitToLast(1);
  const lastTestChild = testSettingRef.orderByChild("timestamp").limitToLast(1);
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
  $scope.testSession ={
    personality:"",
    process:"",
    title:"",
    sessions:[],
    cancel: function(){
      $mdDialog.hide();
    },
    save: function(){
      var sessionLenght = this.sessions.length;
      var sessionId = "session_"+sessionLenght.toString();
      this.sessions.push({
        personality: $scope.testSession.personality,
        process: $scope.testSession.process,
        title: $scope.testSession.title,
        timestamp: Date.now()
      });
      $mdDialog.hide();
    }
  };
  $scope.testSetting = {
    lastChild: $firebaseArray(lastTestChild),
    testSettingList: $firebaseArray(testSettingListQuery),
    toBeSave:{
      max_duration_of_test_scenario_run: 1,
      number_of_epochs:1,
      bot_to_be_test:"",
      timestamp: Date.now(),
      bot_name:""
    },
    save: function(){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(this.toBeSave.title == "" || this.toBeSave.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        testSettingRef.orderByChild("title").equalTo(this.toBeSave.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','test-toast','toast-error');
        }else{
          var id = "test_"+(lastChildId+1).toString();
          testSettingRef.child(id).set(this.toBeSave);
          $scope.showToast('Personality Saved as '+this.toBeSave.title,'test-toast','toast-info');
        }
        
      }
    
    }
  }
  $scope.processSetting = {
    lastChild: $firebaseArray(lastProcessChild),
    processSettingList: $firebaseArray(processSettingListQuery),
    toBeSave:{
      max_turn_per_dialogue: 1,
      number_of_dialogues_per_session:1,
      timestamp: Date.now()
    },
    save: function(){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(this.toBeSave.title == "" || this.toBeSave.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        processSettingRef.orderByChild("title").equalTo(this.toBeSave.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','process-toast','toast-error');
        }else{
          var id = "process_"+(lastChildId+1).toString();
          processSettingRef.child(id).set(this.toBeSave);
          $scope.showToast('Personality Saved as '+this.toBeSave.title,'process-toast','toast-info');
        }
        
      }
    
    }
  };
  $scope.addNewTestSession = function(ev){
    console.log(ev);
     $mdDialog.show({
      templateUrl: 'app/dashboard/bot-setting/session-setting.html',
      scope: $scope,
      preserveScope: true,
      targetEvent: ev
    });
  };

  $scope.personalitySetting = {
    toBeSave: {
      novice: 50,
      cooperative: 50,
      verbose: 50,
      polite:50,
      timestamp: Date.now()
    },
    buttonDisable: true,
    lastChild: $firebaseArray(lastPersonalityChild),
    personalitySettingList: $firebaseArray(personalitySettingListQuery),
    save: function(){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(this.toBeSave.title == "" || this.toBeSave.title === undefined){
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
          var id = "personality_"+(lastChildId+1).toString();
          personalitySettingRef.child(id).set(this.toBeSave);
          $scope.showToast('Personality Saved as '+this.toBeSave.title,'personality-toast','toast-info');
        }
        
      }
    
    }
  };

  $scope.settingsOption={
    personality:{
      novice: 50,
      cooperative: 50,
      verbose: 50,
      polite:50
    }
  };

  $scope.containerLayout = {
    height: $window.innerHeight * 70 /100,
    settingHeight: $window.innerHeight * 85 /100
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

  };

  $scope.processLayout = {
    currentItemIndex: 0,
    addToEdit: function(e,i){
    /*
      - when one of the item child edit button click, enable four action button("duplicate,delete,rename,load")
    */ 
      if(e.target.textContent === "EDITING..."){
        e.target.textContent = "EDIT";
        angular.forEach($scope.processLayout.savedButtons,function(key,value){
          $scope.processLayout.savedButtons[value]=true;
        }) 
      }else{
        e.target.textContent = "EDITING..."; 
        angular.forEach($scope.processLayout.savedButtons,function(key,value){
          $scope.processLayout.savedButtons[value]=false;
        });
        this.currentItemIndex = i;
      };
    },
    clearSavedButtons: function(){
      angular.forEach(this.savedButtons,function(key,value){
        this.savedButtons[value]=true;
      })
    },
    savedButtons: {
      duplicate: true,
      rename: true,
      delete: true,
      load: true,
    },
    duplicateAction: function(args){

    },
    renameAction: function(e){
      var id = this.currentItemIndex;
      var list = $scope.processSetting.processSettingList;
      var item = list[id];
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .title('What would you rename your title?')
        .textContent('Please do not leave your setting name blank')
        .placeholder('process Settting Name')
        .ariaLabel('Process name')
        .initialValue(settingName)
        .targetEvent(e)
        .ok('Okay!')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        item.title = result;
        list.$save(id).then(function(ref) {
          console.log("success");
        });
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    },
    deleteAction: function(e){
      var id = this.currentItemIndex;
      var confirm = $mdDialog.confirm()
            .title('Are you sure you would like to delete this process setting?')
            .textContent('One of your scenarios might have been using this item. Please make sure before you deleted.')
            .ariaLabel('process Setting Remove')
            .targetEvent(e)
            .ok('Please do it!')
            .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        var list = $scope.processSetting.processSettingList;
        var item = list[id];
        list.$remove(item).then(function(ref) {
          angular.forEach($scope.processLayout.savedButtons,function(key,value){
            $scope.processLayout.savedButtons[value]=true;
          })
          console.log("deleted");
        });
      }, function() {
        console.log("stay remain");
      });

      
    },
  };



  $scope.personalityLayout = {
    currentItemIndex: 0,
    addToEdit: function(e,i){
    /*
      - when one of the item child edit button click, enable four action button("duplicate,delete,rename,load")
    */ 
      if(e.target.textContent === "EDITING..."){
        e.target.textContent = "EDIT";
        angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
          $scope.personalityLayout.savedButtons[value]=true;
        }) 
      }else{
        e.target.textContent = "EDITING..."; 
        angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
          $scope.personalityLayout.savedButtons[value]=false;
        });
        this.currentItemIndex = i;
      };
    },
    clearSavedButtons: function(){
      angular.forEach(this.savedButtons,function(key,value){
        this.savedButtons[value]=true;
      })
    },
    savedButtons: {
      duplicate: true,
      rename: true,
      delete: true,
      load: true,
    },
    duplicateAction: function(args){

    },
    renameAction: function(e){
      var id = this.currentItemIndex;
      var list = $scope.personalitySetting.personalitySettingList;
      var item = list[id];
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .title('What would you rename your title?')
        .textContent('Please do not leave your setting name blank')
        .placeholder('Personality Settting Name')
        .ariaLabel('Dog name')
        .initialValue(settingName)
        .targetEvent(e)
        .ok('Okay!')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        item.title = result;
        list.$save(id).then(function(ref) {
          console.log("success");
        });
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    },
    deleteAction: function(e){
      var id = this.currentItemIndex;
      var confirm = $mdDialog.confirm()
            .title('Are you sure you would like to delete this personality setting?')
            .textContent('One of your scenarios might have been using this item. Please make sure before you deleted.')
            .ariaLabel('Personality Setting Remove')
            .targetEvent(e)
            .ok('Please do it!')
            .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        var list = $scope.personalitySetting.personalitySettingList;
        var item = list[id];
        list.$remove(item).then(function(ref) {
          angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
            $scope.personalityLayout.savedButtons[value]=true;
          })
          console.log("deleted");
        });
      }, function() {
        console.log("stay remain");
      });

      
    },
  };

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


  $scope.user = null;
  $scope.users = null;

  $scope.loadUsers = function() {

    // Use timeout to simulate a 650ms request.
    return $timeout(function() {

      $scope.users =  $scope.users  || [
        { id: 1, name: 'API.ai Small Talk' },
        { id: 2, name: 'Infosys Confluence Bot' }
      ];

    }, 650);
  };



});
