'use-strict';
angular.module('app.dashboard')
.controller('botSettingCtrl',function(moment,$scope,$window,$interval,$firebaseObject,$firebaseArray,$mdToast,$mdDialog,$timeout){

  const refData = firebase.database().ref();
  const testSettingRef = refData.child('tests');
  const personalitySettingRef = refData.child('settings').child('personalities');
  const processSettingRef = refData.child('settings').child('processes');
  const testSettingListQuery = testSettingRef.orderByChild("timestamp");
  const personalitySettingListQuery = personalitySettingRef.orderByChild("timestamp");
  const processSettingListQuery = processSettingRef.orderByChild("timestamp");
  const lastPersonalityChild = personalitySettingRef.orderByChild("timestamp").limitToLast(1);
  const lastProcessChild = processSettingRef.orderByChild("timestamp").limitToLast(1);
  const lastTestChild = testSettingRef.orderByChild("timestamp").limitToLast(1);
  var sliderThumb = $window.document.getElementsByClassName("md-thumb");

  $scope.showToast = function (message, parentId,className,delay) {
    var el = angular.element(document.getElementById(parentId));
    var toast = $mdToast.simple()
    .content(message)
    .action('X')
    .position('bottom right')
    .hideDelay(delay)
    .toastClass(className)
    .parent(el);
    $mdToast.show(toast);
  };
  $scope.testSession ={
    addNewTestSession: function(ev){
       $mdDialog.show({
        parent: angular.element(document.querySelector('#test-toast')),
        templateUrl: 'app/dashboard/bot-setting/session-setting.html',
        scope: $scope,
        preserveScope: true,
        targetEvent: ev
      });
    },
    personality:"",
    process:"",
    title:"",
    sessions:{},
    cancel: function(){
      $mdDialog.hide();
    },
    save: function(){
      var sessionLenght = Object.keys(this.sessions).length;
      var sessionId = "session_"+sessionLenght.toString();
      this.sessions[sessionId] ={
        personality: $scope.testSession.personality,
        process: $scope.testSession.process,
        title: $scope.testSession.title,
        timestamp: Date.now()
      };
      $mdDialog.hide();
    }
  };
  $scope.testLayout = {
    next: true,
  }
  $scope.testSetting = {
    lastChild: $firebaseArray(lastTestChild),
    testSettingList: $firebaseArray(testSettingListQuery),
    toBeSave:{
      max_duration_of_test_scenario_run: 1,
      number_of_epochs:1,
      bot_to_be_test:"",
      timestamp: Date.now(),
      sessions: $scope.testSession.sessions,
      title:""
    },
    saveNew: function(obj){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(obj.title == "" || obj.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        testSettingRef.orderByChild("title").equalTo(obj.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','test-toast','toast-error',5000);
        }else{
          var id = "test_"+(lastChildId+1).toString();
          testSettingRef.child(id).set(obj);
          $scope.showToast('test Saved as '+obj.title,'test-toast','toast-info',1000);
        }
        
      }
    }
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
    update: function(obj){
      var id = $scope.personalityLayout.currentItemIndex;
      if(obj.title == "" || obj.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
          var items = this.personalitySettingList;
          items[id].novice = obj.novice;
          items[id].polite = obj.polite;
          items[id].cooperative = obj.cooperative;
          items[id].verbose = obj.verbose;
          items[id].title = obj.title;
          items.$save(id).then(function(ref){
            $scope.showToast('Personality Saved as '+obj.title,'personality-toast','toast-info',1000);
            $scope.personalityLayout.next = true;  
          })
      }
    },
    saveNew: function(obj){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(obj.title == "" || obj.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        personalitySettingRef.orderByChild("title").equalTo(obj.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','personality-toast','toast-error',5000);
        }else{
          var id = "personality_"+(lastChildId+1).toString();
          personalitySettingRef.child(id).set(obj);
          $scope.showToast('Personality Saved as '+obj.title,'personality-toast','toast-info',1000);
          $scope.personalityLayout.next = true;
        }
        
      }
    }
  };
//  Personality Layout start 

  $scope.personalityLayout = {
    update:false,
    done: false,
    showOverlayContent:false,
    next:false,
    selectedIndex: 0,
    currentItemIndex: 0,
    ready: function(){
      this.done = true;
      this.showOverlayContent = true;
    },
    addToEdit: function(e,i){
    /*
      - when one of the item child edit button click, enable four action button("duplicate,delete,rename,load")
    */
      if(e.currentTarget.className === ""){
        e.currentTarget.className = "fa fa-edit fa-fw";
        e.currentTarget.textContent = "";
        angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
          $scope.personalityLayout.savedButtons[value]=true;
        }) 
      }else{
        e.currentTarget.className = "";
        e.currentTarget.textContent = "Editing..."
        angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
          $scope.personalityLayout.savedButtons[value]=false;
        });
        this.currentItemIndex = $scope.personalitySetting.personalitySettingList.$indexFor(i);;
      };
    },
    clearSavedButtons: function(){
      angular.forEach(this.savedButtons,function(key,value){
        this.savedButtons[value]=true;
      })
    },
    nextSetting: function(){

    },
    savedButtons: {
      duplicate: true,
      rename: true,
      delete: true,
      load: true,
    },
    duplicateAction: function(e){
      e.currentTarget.style.background = 'rgb(255, 64, 129)';
      // e.currentTarget.style.background = 'rgb(255, 64, 129)';
      var id = this.currentItemIndex;
      var list = $scope.personalitySetting.personalitySettingList;
      var item = list[id];   
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .parent(angular.element(document.querySelector('#personality-toast')))
        .title('What would you rename your title?')
        .textContent('Please do not leave your setting name blank')
        .placeholder('Personality Settting Name')
        .ariaLabel('Dog name')
        .initialValue(settingName)
        .targetEvent(e)
        .ok('Ok')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        delete item['$id'];
        delete item['$$hashKey'];
        delete item['$priority'];

        var newSetting = {
          title: result,
          novice: item.novice,
          cooperative: item.cooperative,
          verbose: item.verbose,
          polite:item.polite,
          timestamp: Date.now()

        };
        $scope.personalitySetting.saveNew(newSetting);
        // list.$save(id).then(function(ref) {
        //   console.log("success");
        // });
        e.currentTarget.style.background = '';
      }, function() {
        e.currentTarget.style.background = '';
        $scope.status = 'You didn\'t name your dog.';
      });
    },
    renameAction: function(e){
      e.currentTarget.style.background = 'rgb(255, 64, 129)';
      var id = this.currentItemIndex;
      var list = $scope.personalitySetting.personalitySettingList;
      var item = list[id];   
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .parent(angular.element(document.querySelector('#personality-toast')))
        .title('What would you rename your title?')
        .textContent('Please do not leave your setting name blank')
        .placeholder('Personality Settting Name')
        .ariaLabel('Dog name')
        .initialValue(settingName)
        .targetEvent(e)
        .ok('Ok')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        item.title = result;
        list.$save(id).then(function(ref) {
          console.log("success");
        });
        e.currentTarget.style.background = '';
      }, function() {
        e.currentTarget.style.background = '';
        $scope.status = 'You didn\'t name your dog.';
      });
    },
    modifyAction: function(e){
      var id = this.currentItemIndex;
      var list = $scope.personalitySetting.personalitySettingList;
      var selectedSetting = list[id];
      $scope.settingsOption.personality.novice = selectedSetting.novice; 
      $scope.settingsOption.personality.polite = selectedSetting.polite; 
      $scope.settingsOption.personality.cooperative = selectedSetting.cooperative; 
      $scope.settingsOption.personality.verbose = selectedSetting.verbose; 
      $scope.personalitySetting.toBeSave.title = selectedSetting.title;
      this.update = true;
      this.selectedIndex = 0;
    },
    deleteAction: function(e){
      e.currentTarget.style.background = 'rgb(255, 64, 129)';
      var id = this.currentItemIndex;
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.querySelector('#personality-toast')))
        .title('Are you sure you would like to delete this personality setting?')
        .textContent('One of your scenarios might have been using this item. Please make sure before you delete.')
        .ariaLabel('Personality Setting Remove')
        .targetEvent(e)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        var list = $scope.personalitySetting.personalitySettingList;
        var item = list[id];
        list.$remove(item).then(function(ref) {
          angular.forEach($scope.personalityLayout.savedButtons,function(key,value){
            $scope.personalityLayout.savedButtons[value]=true;
          })
          console.log("deleted");
          e.currentTarget.style.background = '';
        });
      }, function() {
        e.currentTarget.style.background = '';
        console.log("stay remain");
      });

      
    },
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

// Process setting layout

  $scope.processSetting = {
    lastChild: $firebaseArray(lastProcessChild),
    processSettingList: $firebaseArray(processSettingListQuery),
    toBeSave:{
      title:"",
      max_turn_per_dialogue: 1,
      number_of_dialogues_per_session:1,
      timestamp: Date.now()
    },
    update: function(obj){
      var id = $scope.processLayout.currentItemIndex;
      if(obj.title == "" || obj.title === undefined){
        $scope.showToast('Please Try Again later !!!','process-toast','toast-error',3000);
      }else{
          var items = this.processSettingList;      
          items[id].title = obj.title;
          items[id].number_of_dialogues_per_session = obj.number_of_dialogues_per_session;
          items[id].max_turn_per_dialogue = obj.max_turn_per_dialogue;
          items.$save(id).then(function(ref){
            $scope.showToast('process Saved as '+obj.title,'process-toast','toast-info',1000);
            $scope.processLayout.next = true;  
          })
      }
    },
    saveNew: function(obj){
      
      var lastChild = this.lastChild[0].$id;
      var regex = /[\d|,|.\+]+/g;
      var matches = lastChild.match(regex);
      var lastChildId = parseInt(matches[0]);
      if(obj.title == "" || obj.title === undefined){
        console.log("Please Try Again later !!!");
      }else{
        var checkTitle;
        var exist = false;
        processSettingRef.orderByChild("title").equalTo(obj.title).once('value',function(snapshot){
          if(snapshot.val() != null){
            exist = true;
          }else{
            exist = false;
          }
        })
        if (exist){
          $scope.showToast('Title already taken ! Please pick another name ','process-toast','toast-error',5000);
        }else{
          var id = "process_"+(lastChildId+1).toString();
          processSettingRef.child(id).set(obj);
          $scope.showToast('process Saved as '+obj.title,'process-toast','toast-info',1000);
          $scope.processLayout.next = true;
        }
        
      }
    }
  };
  $scope.processLayout = {
    update:false,
    showOverlayContent:false,
    done: false,
    next:false,
    selectedIndex:0,
    currentItemIndex: 0,
    ready: function(){
      this.done = true;
      this.showOverlayContent = true;
    },
    addToEdit: function(e,i){
    /*
      - when one of the item child edit button click, enable four action button("duplicate,delete,rename,load")
    */ 
       if(e.currentTarget.className === ""){
        e.currentTarget.className = "fa fa-edit fa-fw";
        e.currentTarget.textContent = "";
        angular.forEach($scope.processLayout.savedButtons,function(key,value){
          $scope.processLayout.savedButtons[value]=true;
        }) 
      }else{
        e.currentTarget.className = "";
        e.currentTarget.textContent = "Editing..."
        angular.forEach($scope.processLayout.savedButtons,function(key,value){
          $scope.processLayout.savedButtons[value]=false;
        });
        this.currentItemIndex = $scope.processSetting.processSettingList.$indexFor(i);;
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
    duplicateAction: function(e){
      e.currentTarget.style.background = 'rgb(255, 64, 129)';
      var id = this.currentItemIndex;
      var list = $scope.processSetting.processSettingList;
      var item = list[id];   
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .parent(angular.element(document.querySelector('#process-toast')))
        .title('What would you rename your title?')
        .textContent('Please do not leave your setting name blank')
        .placeholder('Personality Settting Name')
        .ariaLabel('Dog name')
        .initialValue(settingName)
        .targetEvent(e)
        .ok('Ok')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        delete item['$id'];
        delete item['$$hashKey'];
        delete item['$priority'];

        var newSetting = {
          max_turn_per_dialogue: item.max_turn_per_dialogue,
          number_of_dialogues_per_session: item.number_of_dialogues_per_session,
          title: result,
          timestamp: Date.now()

        };
        $scope.processSetting.saveNew(newSetting);
        e.currentTarget.style.background = '';
      }, function() {
        e.currentTarget.style.background = '';
        $scope.status = 'You didn\'t name your dog.';
      });
    },
    renameAction: function(e){
      e.currentTarget.style.background = 'rgb(255, 64, 129)';
      var id = this.currentItemIndex;
      var list = $scope.processSetting.processSettingList;
      var item = list[id];
      var settingName = item.title;
      var confirm = $mdDialog.prompt()
        .parent(angular.element(document.querySelector('#process-toast')))
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
    modifyAction: function(e){
      var id = this.currentItemIndex;
      var list = $scope.processSetting.processSettingList;
      var selectedSetting = list[id];
      $scope.processSetting.toBeSave.title = selectedSetting.title;
      $scope.processSetting.toBeSave.max_turn_per_dialogue = selectedSetting.max_turn_per_dialogue;
      $scope.processSetting.toBeSave.number_of_dialogues_per_session = selectedSetting.number_of_dialogues_per_session;
      this.update = true;
      this.selectedIndex = 0;
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

  $scope.$watchCollection("settingsOption.personality", function(newValue, oldValue) {

    if($scope.settingsOption.personality != null){
      angular.forEach($scope.abilityDraft,function(v,key){
      switch(v.name){
        case 'Novice':
        v.value = newValue.novice;
        break;
        case 'Cooperative':
        v.value = newValue.cooperative;
        break;
        case 'Verbose':
        v.value = newValue.verbose;
        break;
        case 'Polite':
        v.value = newValue.polite;
        break;
      }
      })
    }
    
      
  });
  $scope.sortItems = {
    personalityItem:["timestamp","title","novice","cooperative","verbose","polite"],
    processItem:["timestamp","title"]
  }
  $scope.selectedItem = {
    personality:"title",
    process:"title"
  }

  $scope.user = null;
  $scope.users = null;

  $scope.loadUsers = function() {

    // Use timeout to simulate a 650ms request.
    return $timeout(function() {

      $scope.users =  $scope.users  || [
        { id: 1, name: 'API.ai Small Talk' },
        { id: 2, name: 'API.ai Weather' }
      ];

    }, 650);
  };



});
